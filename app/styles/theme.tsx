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
      accent: '#c5a059',      // Keeping this as accent
      yellow: '#FFCC00',      // Traffic yellow for BAPTISTRY branding
      yellowHover: '#FFD740', // Lighter yellow for hover states
      yellowGlow: 'rgba(255, 204, 0, 0.3)', // Glow effect
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
      yellow: '#FFD740',      // Brighter yellow for dark mode
      yellowHover: '#FFE57F', // Lighter hover for dark mode
      yellowGlow: 'rgba(255, 215, 64, 0.3)', // Glow effect for dark mode
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