// app/styles/theme.ts
// Central theme configuration for BAPTISTRY

export const theme = {
  // Light Mode Colors
  light: {
    background: {
      primary: '#f9fafb',
      secondary: '#ffffff',
      card: '#ffffff',
      sidebar: '#ffffff',
      header: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#374151',
      muted: '#6b7280',
      inverse: '#ffffff',
    },
    border: {
      primary: '#e5e7eb',
      secondary: '#d1d5db',
    },
    brand: {
      primary: '#1e3a5f',
      secondary: '#2563eb',
      accent: '#c5a059',
      yellow: '#D4A017',      // Professional golden-yellow (like BATASnatin)
      yellowHover: '#E8B830', // Brighter gold for hover
      yellowGlow: 'rgba(212, 160, 23, 0.3)', // Subtle glow
    },
    feedback: {
      helpful: '#22c55e',
      unhelpful: '#ef4444',
    },
  },
  
  // Dark Mode Colors
  dark: {
    background: {
      primary: '#111827',
      secondary: '#1f2937',
      card: '#1f2937',
      sidebar: '#111827',
      header: '#1f2937',
    },
    text: {
      primary: '#f9fafb',
      secondary: '#d1d5db',
      muted: '#9ca3af',
      inverse: '#111827',
    },
    border: {
      primary: '#374151',
      secondary: '#4b5563',
    },
    brand: {
      primary: '#3b6ea0',
      secondary: '#60a5fa',
      accent: '#e0c080',
      yellow: '#D4A017',      // Same golden-yellow for dark mode
      yellowHover: '#E8B830',
      yellowGlow: 'rgba(212, 160, 23, 0.3)',
    },
    feedback: {
      helpful: '#4ade80',
      unhelpful: '#f87171',
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, -apple-system, sans-serif',
      heading: 'Georgia, serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  
  // Border Radius
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  
  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
};

export const getTheme = (mode: 'light' | 'dark') => {
  return theme[mode];
};

export default theme;