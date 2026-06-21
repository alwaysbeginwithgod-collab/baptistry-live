// app/utils/themeUtils.ts
// Utility functions for theme management

type ThemeMode = 'light' | 'dark';

// Get the current theme mode
export const getCurrentTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

// Toggle theme
export const toggleTheme = (): void => {
  if (typeof window === 'undefined') return;
  const isDark = document.documentElement.classList.contains('dark');
  if (isDark) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
};

// Get theme from localStorage
export const getStoredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem('theme') as ThemeMode) || 'light';
};

// Apply theme on load
export const applyStoredTheme = (): void => {
  if (typeof window === 'undefined') return;
  const theme = getStoredTheme();
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};