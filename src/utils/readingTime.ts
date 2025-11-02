/**
 * Calculate the estimated reading time for a text
 * @param content - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200 words per minute)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  // Remove HTML tags and markdown syntax
  const plainText = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/[#*_~[\]()]/g, '') // Remove markdown symbols
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
    .trim();

  // Count words
  const words = plainText.split(/\s+/).filter(word => word.length > 0).length;

  // Calculate reading time
  const minutes = Math.ceil(words / wordsPerMinute);

  return Math.max(1, minutes); // Minimum 1 minute
}

/**
 * Format reading time as a string
 * @param minutes - Reading time in minutes
 * @returns Formatted string (e.g., "5 min read")
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}
