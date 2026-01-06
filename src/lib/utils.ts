/**
 * Example utility functions for testing
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isStrongPassword(password: string): boolean {
  return password.length >= 8;
}

/**
 * Format date
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-MX');
}

/**
 * Calculate total time
 */
export function calculateTotalTime(prepTime: number, cookTime: number): number {
  return prepTime + cookTime;
}

/**
 * Truncate text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
