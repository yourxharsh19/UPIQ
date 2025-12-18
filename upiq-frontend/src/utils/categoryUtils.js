/**
 * Utility functions for category colors and icons
 * Provides consistent color/icon assignment and retrieval
 */

// Predefined color palette for categories
export const CATEGORY_COLORS = [
  { name: 'Blue', value: '#3b82f6', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  { name: 'Red', value: '#ef4444', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  { name: 'Green', value: '#10b981', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  { name: 'Yellow', value: '#f59e0b', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  { name: 'Purple', value: '#8b5cf6', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  { name: 'Pink', value: '#ec4899', bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
  { name: 'Cyan', value: '#06b6d4', bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' },
  { name: 'Indigo', value: '#6366f1', bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
  { name: 'Orange', value: '#f97316', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  { name: 'Teal', value: '#14b8a6', bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' },
];

// Predefined emoji/icons for categories
export const CATEGORY_ICONS = [
  '💰', '💸', '🍔', '🚗', '🏠', '👕', '💊', '🎓', '🎮', '📱',
  '✈️', '🍕', '☕', '🎬', '🏋️', '💼', '🎁', '💳', '📚', '🎨',
  '🏥', '🎵', '🌮', '🍺', '🚌', '🏖️', '🛒', '💻', '📺', '🎯'
];

/**
 * Get a consistent color for a category name
 */
export const getCategoryColor = (categoryName, customColor = null) => {
  if (customColor) {
    const color = CATEGORY_COLORS.find(c => c.value === customColor);
    if (color) return color;
  }
  
  // Hash function for consistent color assignment
  if (!categoryName) return CATEGORY_COLORS[0];
  const index = categoryName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[index];
};

/**
 * Get a consistent icon/emoji for a category
 */
export const getCategoryIcon = (categoryName, customIcon = null) => {
  if (customIcon) return customIcon;
  
  // Hash function for consistent icon assignment
  if (!categoryName) return CATEGORY_ICONS[0];
  const index = categoryName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % CATEGORY_ICONS.length;
  return CATEGORY_ICONS[index];
};

/**
 * Get category display props (color, icon, etc.)
 */
export const getCategoryDisplayProps = (category) => {
  const name = category?.name || 'Uncategorized';
  const color = getCategoryColor(name, category?.color);
  const icon = getCategoryIcon(name, category?.icon);
  
  return {
    name,
    color,
    icon,
    colorValue: color.value,
    colorClasses: {
      bg: color.bg,
      text: color.text,
      border: color.border
    }
  };
};

