/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Bright & Elegant (from design system)
        primary: '#4fb3a8',           // Bright teal/mint
        'primary-dark': '#3a9d92',     // Darker for hover
        'primary-light': '#6bc4b9',    // Lighter variant
        'primary-lighter': '#87d5cc',   // Very light
        'primary-soft': '#e8f7f5',     // Soft background tint
        
        // Alternative Greens
        'medical-green': '#52b788',    // Brighter medical green
        'sage-green': '#95c5a0',       // Lighter sage green
        
        // Background Colors - Bright & Clean
        bgPrimary: '#ffffff',
        bgSecondary: '#f8fdfc',      // Very light mint tint
        bgTertiary: '#fafafa',
        bgSection: '#f0f9f7',       // Soft mint background
        
        // Text Colors - Softer & Brighter
        darkTeal: '#1a3d3a',        // Darker teal (primary text)
        mediumTeal: '#4a6b68',      // Medium teal-gray (secondary text)
        lightTeal: '#7a9a97',       // Light teal-gray (light text)
        
        // Status Colors - Brighter & Softer
        success: '#52c41a',           // Brighter success green
        warning: '#ffa940',            // Softer orange
        error: '#ff7875',              // Softer red
        info: '#40a9ff',               // Brighter blue
        
        // Border Colors
        borderLight: '#e6f3f1',     // Very light teal tint
        borderMedium: '#d1e8e5',
        borderDark: '#b8d6d2',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],  // For headings
      },
      fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem',     // 48px
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        sm: '0 2px 4px rgba(0, 0, 0, 0.05)',
        md: '0 2px 8px rgba(0, 0, 0, 0.08)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}

