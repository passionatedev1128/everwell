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
        'primary-darker': '#8FA00D',   // Even darker for active/pressed states
        'primary-light': '#D4E83A',    // Lighter variant
        'primary-lighter': '#E8F15C',  // Very light variant
        'primary-accent': '#BBE02A',   // Accent variant for hero text
        'primary-soft': '#F5F9D8',     // Soft background tint
        'primary-ultra-light': '#FAFCE8', // Ultra light for very subtle backgrounds
        
        // Brand Identity Colors
        brandBlack: '#000000',         // Black - Main color, energy and modernity
        brandGray: '#C7C7C7',          // Light gray - Readability, contrast, stability
        brandWhite: '#FFFFFF',          // White - Neutral base, visual cleanliness
        
        // Background Colors - Enhanced for comfort and elegance
        bgPrimary: '#FFFFFF',          // White - Neutral base
        bgSecondary: '#FAFAFA',         // Very light gray for subtle backgrounds
        bgTertiary: '#F5F5F5',         // Light gray background
        bgSection: '#F9F9F9',          // Section background
        bgElevated: '#FFFFFF',          // For elevated cards and modals
        bgSubtle: '#FEFEFE',           // Almost white for elegant backgrounds
        bgWarm: '#FFFEFB',              // Warm white for comfort
        bgCool: '#FAFCFD',              // Cool white for modern feel
        
        // Text Colors - Enhanced hierarchy for better readability
        darkTeal: '#1A1A1A',           // Near black - Primary text (softer than pure black)
        mediumTeal: '#4A4A4A',         // Dark gray - Secondary text
        lightTeal: '#6B7280',          // Medium gray - Tertiary text (improved contrast)
        mutedTeal: '#9CA3AF',          // Light gray - Muted text
        subtleTeal: '#C7C7C7',         // Very light gray - Subtle text
        
        // Status Colors - Enhanced for better UX and elegance
        success: '#10B981',            // Modern success green (softer, more elegant)
        'success-light': '#D1FAE5',    // Light success background
        'success-dark': '#059669',      // Dark success for hover
        warning: '#F59E0B',            // Modern warning amber (warmer, friendlier)
        'warning-light': '#FEF3C7',    // Light warning background
        'warning-dark': '#D97706',      // Dark warning for hover
        error: '#EF4444',              // Modern error red (softer, less harsh)
        'error-light': '#FEE2E2',      // Light error background
        'error-dark': '#DC2626',        // Dark error for hover
        info: '#3B82F6',               // Modern info blue (vibrant but elegant)
        'info-light': '#DBEAFE',       // Light info background
        'info-dark': '#2563EB',         // Dark info for hover
        
        // Border Colors - Enhanced for elegance
        borderLight: '#E5E7EB',        // Very light gray (softer)
        borderMedium: '#D1D5DB',       // Medium gray (improved)
        borderDark: '#9CA3AF',         // Darker gray (better contrast)
        borderSubtle: '#F3F4F6',       // Subtle border for cards
        borderPrimary: 'rgba(192, 223, 22, 0.2)', // Primary border with opacity
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
        sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
        md: '0 4px 12px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 30px rgba(0, 0, 0, 0.08)',
        xl: '0 20px 50px rgba(0, 0, 0, 0.1)',
        'primary-sm': '0 2px 8px rgba(192, 223, 22, 0.15)',
        'primary-md': '0 4px 16px rgba(192, 223, 22, 0.2)',
        'primary-lg': '0 8px 32px rgba(192, 223, 22, 0.25)',
        'elegant': '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)',
        'soft': '0 2px 12px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}

