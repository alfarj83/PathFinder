// utils/formatters.ts
// Utility functions for normalizing and formatting numeric values from Supabase responses

// Convert any input (string, number, null) to a number, returning 0 if invalid
export const toNumber = (value: any): number => {
  if (value == null) return 0;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
};

// Format a rating value (string or number) for display, or return 'N/A' if invalid
export const formatRating = (value: any): string => {
  if (value == null) return 'N/A';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'N/A';
  return num.toFixed(1);
};

// Format a rating and append "/5" when valid
export const formatRatingWithMax = (value: any): string => {
  const formatted = formatRating(value);
  return formatted === 'N/A' ? 'N/A' : `${formatted}/5`;
};

// Check if the given input can be interpreted as a valid number
export const isValidNumber = (value: any): boolean => {
  if (value == null) return false;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num);
};

// Return a color hex string representing a rating tier (green → orange → red → gray)
export const getRatingColor = (value: any): string => {
  const rating = toNumber(value);
  if (rating >= 4) return '#4CAF50';
  if (rating >= 3) return '#FFA726';
  if (rating > 0) return '#EF5350';
  return '#999'; // Gray for missing or zero rating
};

// Return a color hex string for difficulty (inverse of rating: easier → greener)
export const getDifficultyColor = (value: any): string => {
  const difficulty = toNumber(value);
  if (difficulty === 0) return '#999'; // Gray for missing or zero difficulty
  if (difficulty <= 2) return '#4CAF50';
  if (difficulty <= 3.5) return '#FFA726';
  return '#EF5350';
};
