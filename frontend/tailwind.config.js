/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Brand Identity (from brandbook)
        // #C0DF16 - Main color: Energy and modernity, visual signature
        primary: '#C0DF16',           // Lime green - Main brand color
        'primary-dark': '#A8C512',    // Darker for hover states
        'primary-light': '#D4E83A',    // Lighter variant
        'primary-lighter': '#E8F15C',  // Very light variant
        'primary-soft': '#F5F9D8',     // Soft background tint
        
        // Brand Identity Colors
        brandBlack: '#000000',         // Black - Main color, energy and modernity
        brandGray: '#C7C7C7',          // Light gray - Readability, contrast, stability
        brandWhite: '#FFFFFF',          // White - Neutral base, visual cleanliness
        
        // Background Colors - Based on brandbook
        bgPrimary: '#FFFFFF',          // White - Neutral base
        bgSecondary: '#FAFAFA',         // Very light gray for subtle backgrounds
        bgTertiary: '#F5F5F5',         // Light gray background
        bgSection: '#F9F9F9',          // Section background
        
        // Text Colors - Based on brandbook
        darkTeal: '#000000',           // Black - Primary text (energy and modernity)
        mediumTeal: '#4A4A4A',         // Dark gray - Secondary text
        lightTeal: '#C7C7C7',          // Brand gray - Light text (readability, contrast)
        
        // Status Colors - Maintained for functionality
        success: '#52c41a',            // Success green
        warning: '#ffa940',            // Warning orange
        error: '#ff7875',              // Error red
        info: '#40a9ff',               // Info blue
        
        // Border Colors - Based on brandbook gray
        borderLight: '#E5E5E5',        // Very light gray
        borderMedium: '#C7C7C7',       // Brand gray
        borderDark: '#999999',         // Darker gray
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

