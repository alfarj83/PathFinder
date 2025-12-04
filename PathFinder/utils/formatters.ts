// utils/formatters.ts
// Helper functions for handling data from Supabase where numbers may come as strings

/**
 * Safely converts any value to a number
 * Handles strings, numbers, null, and undefined
 */
export const toNumber = (value: any): number => {
  if (value == null) return 0;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
};

/**
 * Formats a rating value for display
 * Returns 'N/A' for null/undefined/invalid values
 */
export const formatRating = (value: any): string => {
  if (value == null) return 'N/A';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'N/A';
  return num.toFixed(1);
};

/**
 * Formats a rating with /5 suffix
 */
export const formatRatingWithMax = (value: any): string => {
  const formatted = formatRating(value);
  return formatted === 'N/A' ? 'N/A' : `${formatted}/5`;
};

/**
 * Checks if a value is a valid number (not null, undefined, or NaN)
 */
export const isValidNumber = (value: any): boolean => {
  if (value == null) return false;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num);
};

/**
 * Get rating color based on value (handles string input)
 */
export const getRatingColor = (value: any): string => {
  const rating = toNumber(value);
  if (rating >= 4) return '#4CAF50';
  if (rating >= 3) return '#FFA726';
  if (rating > 0) return '#EF5350';
  return '#999'; // Gray for no rating
};

/**
 * Get difficulty color based on value (handles string input)
 * Lower difficulty = green, higher = red
 */
export const getDifficultyColor = (value: any): string => {
  const difficulty = toNumber(value);
  if (difficulty === 0) return '#999'; // Gray for no rating
  if (difficulty <= 2) return '#4CAF50';
  if (difficulty <= 3.5) return '#FFA726';
  return '#EF5350';
};