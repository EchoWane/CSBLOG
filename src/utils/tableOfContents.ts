export interface Heading {
  depth: number;
  text: string;
  slug: string;
}

/**
 * Extract headings from markdown content
 * @param content - The markdown content
 * @returns Array of heading objects with depth, text, and slug
 */
export function getHeadings(content: string): Heading[] {
  const headings: Heading[] = [];

  // Match markdown headings (## Heading, ### Heading, etc.)
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const depth = match[1].length; // Number of # characters
    const text = match[2].trim();
    const slug = generateSlug(text);

    headings.push({
      depth,
      text,
      slug,
    });
  }

  return headings;
}

/**
 * Generate a URL-friendly slug from heading text
 * @param text - The heading text
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Inject IDs into heading elements for anchor linking
 * @param html - The rendered HTML content
 * @param headings - Array of headings with slugs
 * @returns HTML with ID attributes added to headings
 */
export function injectHeadingIds(html: string, headings: Heading[]): string {
  let modifiedHtml = html;

  headings.forEach(({ text, slug }) => {
    // Match h2, h3, h4 tags containing the exact text
    const headingPattern = new RegExp(
      `(<h[2-4][^>]*>)(${escapeRegExp(text)})(</h[2-4]>)`,
      'i'
    );

    modifiedHtml = modifiedHtml.replace(
      headingPattern,
      `$1<span id="${slug}"></span>$2$3`
    );
  });

  return modifiedHtml;
}

/**
 * Escape special regex characters in a string
 * @param str - String to escape
 * @returns Escaped string
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
