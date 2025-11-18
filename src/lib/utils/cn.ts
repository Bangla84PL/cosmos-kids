/**
 * Utility function to merge Tailwind CSS classes
 * Combines multiple class strings and handles conditional classes
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}
