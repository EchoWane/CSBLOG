---
title: "Padding Oracle Attack"
date: 2025-11-02
tags: ["cryptography", "cbc", "oracle-attack"]
authors: ["amir"]
draft: false
---

## What's a Padding Oracle?

CBC mode encryption needs padding to fill incomplete blocks. PKCS#7 padding adds bytes equal to the number of padding bytes needed. A padding oracle is any system that tells you whether decrypted ciphertext has valid padding.

That tiny information leak? Enough to decrypt everything.

## How CBC Works

CBC (Cipher Block Chaining) XORs each plaintext block with the previous ciphertext block before encryption. Decryption reverses this:
```
Plaintext = Decrypt(Ciphertext) XOR Previous_Ciphertext_Block
```

The attacker controls the previous ciphertext block. Control the XOR input, control the plaintext output.

## The Attack

The server might return different errors for invalid padding vs invalid data. That's the oracle.

1. Take the last ciphertext block you want to decrypt
2. Prepend a block of random bytes (your IV or Initial Vector)
3. Modify the IV byte by byte until padding is valid
4. Valid padding means the last decrypted byte XORed with your IV byte equals `0x01`
5. Solve for the decrypted byte
6. Repeat for each byte, adjusting padding expectations

Brute-forcing one byte at a time using the oracle's responses. 256 attempts per byte maximum.

## Real World Example

Classic case: ASP.NET's `padding is invalid` error message. Attackers could:
- Decrypt session cookies
- Decrypt ViewState
- Forge authentication tokens

All because the server told you "bad padding" vs "bad MAC" or just timed out differently.

## The Fix

**Never** leak padding validity:
- Use authenticated encryption (GCM, ChaCha20-Poly1305)
- Return generic errors for all decryption failures
- Constant-time operations for validation

The lesson: information leaks matter. Even a single bit.