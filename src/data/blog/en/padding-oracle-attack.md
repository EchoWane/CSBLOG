---
author: "amir_rabiee"
pubDatetime: 2025-11-16T22:58:45.51
title: "Padding Oracle Attack"
featured: false
draft: false
archived: false
tags:
  - cbc
  - ciphers
  - crypto
description: On Padding Oracle Attack
---

## What's a Padding Oracle?

You know that feeling when you're debugging and an error message tells you *exactly* what went wrong? Super helpful, right? Well, in crypto, that helpfulness can burn your entire system to the ground.

CBC mode encryption needs padding to fill incomplete blocks. Think of it like packing a box—if your stuff doesn't fill it completely, you stuff newspaper in the gaps. PKCS#7 padding does exactly this: if you need 3 bytes to complete a block, it adds three bytes, each with value `0x03`. Need 7? Seven bytes of `0x07`. Simple pattern.

A padding oracle is any system that leaks whether decrypted ciphertext has valid padding. Could be an error message. Could be a timing difference. Could be a different HTTP status code. Doesn't matter—any signal that says "yeah the padding checked out" or "nah that padding was fucked" is enough.

That tiny information leak? Enough to decrypt everything. No keys needed.

## How CBC Actually Works

CBC (Cipher Block Chaining) XORs each plaintext block with the previous ciphertext block before encryption. It's chaining blocks together so identical plaintext blocks don't produce identical ciphertext. 

Decryption reverses this process:
```
Plaintext = Decrypt(Ciphertext) XOR Previous_Ciphertext_Block
```

Here's the kicker: **the attacker controls the previous ciphertext block**. They can flip bits in it and directly manipulate what comes out after XOR. Control the XOR input, control the plaintext output. This is the lever that makes the whole attack work.

## The Attack in Detail

Let's say a server returns different errors for invalid padding vs invalid data. Maybe it's "Padding is invalid" vs "MAC verification failed". Maybe one times out after 100ms and the other after 50ms. Doesn't matter. That difference? That's your oracle.

Here's how you exploit it:

**Step 1:** Grab the ciphertext block you want to decrypt. Let's call the last block `C2`.

**Step 2:** Prepend a block of random bytes (call it `C1`). You're sending `C1 || C2` to the server.

**Step 3:** Start modifying the last byte of `C1`. Send the modified payload to the server. Try values 0x00, 0x01, 0x02... up to 0xFF.

**Step 4:** Watch for when the server says "valid padding". Let's say that happens when `C1[15] = 0x42`.

**Step 5:** Now you know something: when decrypting `C2`, the last byte XORed with `0x42` produced valid padding—specifically `0x01` (since that's valid PKCS#7 padding for the last byte).

So: `Decrypt(C2[15]) XOR 0x42 = 0x01`

Therefore: `Decrypt(C2[15]) = 0x01 XOR 0x42 = 0x43`

You just recovered one byte of the decrypted ciphertext. No keys. Just patience.

**Step 6:** Now you want the second-to-last byte. But valid padding for the last two bytes should be `0x02 0x02`. You already know how to make the last byte `0x01`, so adjust `C1[15]` to make it `0x02` instead:

`C1[15] = 0x43 XOR 0x02 = 0x41`

Now brute-force `C1[14]` until you get valid padding. When you do, you've found the second byte.

**Step 7:** Repeat. For three bytes of padding, adjust to make the last three bytes `0x03 0x03 0x03`, then brute-force `C1[13]`. Keep going until you've recovered the entire block.

Maximum 256 attempts per byte. For a 16-byte block, that's at most 4096 requests to decrypt the entire block. Totally doable.

## Why This Is Devastating

You're not attacking the encryption algorithm. AES could be perfect. The key could be 256 bits of pure entropy. Doesn't matter.

You're attacking the *implementation*. The protocol. The side channel that whispers "yes" or "no" about padding validity.

And once you can decrypt blocks, you can usually forge them too. Same technique in reverse—craft ciphertext that decrypts to whatever you want.

## Real World: The ASP.NET Disaster

In 2010, researchers showed that ASP.NET was vulnerable to padding oracle attacks. The framework returned different error messages and response times depending on whether padding validation or MAC verification failed.

Attackers could:
- **Decrypt session cookies** - steal authenticated sessions without touching the database
- **Decrypt ViewState** - ViewState contains form data, often including sensitive info
- **Forge authentication tokens** - create valid cookies for any user account

All because ASP.NET told you "bad padding" instead of just "decryption failed". Microsoft pushed emergency patches. But guess what? Years later, tons of sites were still vulnerable because people don't update shit.

The attack worked remotely. No local access needed. Just send HTTP requests and watch the responses.

## Other Examples You've Definitely Seen

**TLS (SSL) attacks**: Lucky13, POODLE, and friends all exploited padding oracle vulnerabilities in older TLS versions. Browsers and servers had to be patched. Protocols had to be deprecated.

**OpenSSL CVE-2016-2107**: Padding oracle in the AES-NI implementation. Remote attackers could decrypt traffic.

**CAPTCHA bypass**: Some implementations encrypted CAPTCHA answers with CBC. Padding oracle = you could forge valid CAPTCHA responses. Security through obscurity at its finest.

**JWT tokens**: Some JWT libraries using CBC mode leaked padding validity through error messages. Decrypt user tokens, forge admin tokens, own the system.

The pattern is always the same: someone thought "eh, what's the harm in being specific with error messages?" and accidentally handed attackers a master key.

## The Math Under The Hood

If you want to understand *why* this works at the bit level:

CBC decryption for block `i` is:
```
P[i] = D(C[i]) XOR C[i-1]
```

Where:
- `P[i]` is plaintext block i
- `C[i]` is ciphertext block i  
- `C[i-1]` is the previous ciphertext block (or IV for the first block)
- `D()` is the block cipher decryption function

The decryption function `D()` is deterministic—same ciphertext always gives same intermediate value. But you control `C[i-1]`, which means you control the XOR operation.

For valid PKCS#7 padding, the last `n` bytes must all equal `n`. So if the last byte is `0x01`, the padding is valid. If the last two bytes are `0x02 0x02`, valid. Last three `0x03 0x03 0x03`, valid. You get it.

When you modify `C[i-1][15]` and the server says "valid padding", you know:
```
D(C[i])[15] XOR C[i-1][15] = 0x01
```

Rearrange:
```
D(C[i])[15] = 0x01 XOR C[i-1][15]
```

You know `C[i-1][15]` (you set it), and you know the result must be `0x01` for valid padding. Solve for `D(C[i])[15]`.

Then, since you eventually need the *original* plaintext, you use the original `C[i-1]` value:
```
P[i][15] = D(C[i])[15] XOR C_original[i-1][15]
```

Boom. Plaintext byte recovered.

## Timing Attacks Make It Worse

Even if a server returns the same error message for bad padding and bad MAC, it might *process* them differently. 

Pseudocode for a vulnerable implementation:
```python
def decrypt(ciphertext):
    plaintext = cipher.decrypt(ciphertext)
    if not valid_padding(plaintext):
        raise DecryptionError("Failed")
    if not valid_mac(plaintext):
        raise DecryptionError("Failed")
    return plaintext
```

Looks fine, same error message. But `valid_mac()` never runs if padding is invalid. So:
- Invalid padding: returns error immediately (~10ms)
- Valid padding, invalid MAC: runs MAC check, then returns error (~50ms)

Attackers measure response times. If a request takes longer, padding was valid. Same oracle, different channel.

## The Correct Fix

**Use authenticated encryption**. Period.

- **AES-GCM** (Galois/Counter Mode)
- **ChaCha20-Poly1305**
- **AES-GCM-SIV** if you're fancy

These modes authenticate *before* they decrypt. If the authentication tag doesn't match, decryption never happens. No plaintext to check padding on. No oracle.

If you're stuck with CBC (legacy systems, compatibility, whatever):

1. **Always authenticate then decrypt**. Check MAC before touching padding.
2. **Return identical errors** for all decryption failures. Same message, same HTTP status, same timing.
3. **Constant-time operations**. Your padding check shouldn't leak timing info. Compare every byte even after finding a bad one.
4. **Don't log specifics**. Your logs shouldn't say "invalid padding at byte 7". Just "decryption failed".

Example of proper error handling:
```python
def decrypt(ciphertext):
    try:
        if not constant_time_mac_verify(ciphertext):
            sleep_random_jitter()
            raise DecryptionError("Decryption failed")
        
        plaintext = cipher.decrypt(ciphertext)
        
        if not constant_time_padding_check(plaintext):
            sleep_random_jitter()
            raise DecryptionError("Decryption failed")
        
        return plaintext
    except Exception:
        sleep_random_jitter()
        raise DecryptionError("Decryption failed")
```

Notice: same error message, jitter added to timing, MAC checked first.

## Why Developers Keep Messing This Up

Helpful error messages are good for debugging. "Invalid padding at offset 12" tells you exactly where to look. But that helpfulness kills security.

The problem is mental model. Developers think:
- "Encryption prevents reading the data" ✓ True
- "So error messages about encrypted data are safe" ✗ False

Side channels aren't intuitive. The idea that *error messages* or *timing differences* leak enough to decrypt everything feels wrong. It's one bit of information per request—how bad could it be?

Really fucking bad, turns out.

Crypto is unforgiving. You can do everything else right—strong algorithm, good key management, proper random number generation—and still get owned because your error message was too chatty.

## The Broader Lesson

Padding oracle attacks are a case study in side-channel attacks. The encryption itself was fine. The implementation leaked just enough information to unravel everything.

This pattern shows up everywhere:
- **Timing attacks** - how long operations take reveals secret values
- **Power analysis** - measuring power consumption during crypto operations
- **Cache timing** - CPU cache behavior leaks information about secret keys
- **Acoustic attacks** - yes, the sound your CPU makes can leak keys (look up RSA acoustic attacks)

The padding oracle is just the most accessible example. You don't need oscilloscopes or physical access. Just curl and a script.

## Tools and Practice

**Damn Vulnerable Web Application (DVWA)** has padding oracle challenges. Good for learning without breaking actual systems.

**CryptoPals** (cryptopals.com) has a challenge set specifically for this. Build the attack yourself. You'll understand it way better than just reading about it.

## Don't Be That Guy

If you're building a system that does decryption:

- Use authenticated encryption
- If you can't, audit your error handling and timing
- Test with tools like PadBuster against your own system
- Assume attackers will find every bit of leaked information

The padding oracle has been known since 2002 (Vaudenay's paper). It's 2025. We have better tools now. Use them.

Information leaks matter. Even a single bit can cascade into total compromise. Respect the oracle, or become a case study in someone else's blog post.
