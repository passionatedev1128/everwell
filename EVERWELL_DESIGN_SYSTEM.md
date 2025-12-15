# EverWell - Complete Design System

## 🎨 Combined Color Palette

### Primary Colors - Bright & Elegant
```css
/* Main Brand Color - Bright Teal/Mint (Elegant & Fresh) */
--primary: #4fb3a8;           /* Bright teal - elegant and fresh */
--primary-dark: #3a9d92;      /* Slightly darker for hover */
--primary-light: #6bc4b9;     /* Lighter variant */
--primary-lighter: #87d5cc;   /* Very light for backgrounds */
--primary-soft: #e8f7f5;     /* Soft background tint */

/* Alternative: Brighter Medical Green */
--medical-green: #52b788;    /* Brighter medical green */
--sage-green: #95c5a0;       /* Lighter sage green */
```

### Secondary Colors - Elegant Accents
```css
/* Bright, Elegant Accents */
--accent-gold: #f4c430;      /* Bright, elegant gold */
--accent-gold-light: #f9d976;
--accent-pink: #ffb6c1;      /* Soft pink accent */
--accent-lavender: #d8bfd8;  /* Elegant lavender */

/* Background Colors - Bright & Clean */
--bg-primary: #ffffff;
--bg-secondary: #f8fdfc;      /* Very light mint tint */
--bg-tertiary: #fafafa;
--bg-section: #f0f9f7;       /* Soft mint background */
--bg-elegant: #fefefe;        /* Almost white for elegance */
```

### Text Colors - Softer & Brighter
```css
--text-primary: #1a3d3a;     /* Darker teal instead of dark gray */
--text-secondary: #4a6b68;   /* Medium teal-gray */
--text-light: #7a9a97;       /* Light teal-gray */
--text-inverse: #ffffff;     /* White on colored bg */
```

### Status Colors - Brighter & Softer
```css
--success: #52c41a;          /* Brighter success green */
--warning: #ffa940;          /* Softer orange */
--error: #ff7875;            /* Softer red */
--info: #40a9ff;             /* Brighter blue */
```

### Border & Divider - Lighter
```css
--border-light: #e6f3f1;     /* Very light teal tint */
--border-medium: #d1e8e5;
--border-dark: #b8d6d2;
```

---

## 📝 Typography

### Font Family
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-secondary: 'Poppins', sans-serif; /* For CTAs and headings */
```

### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;     /* 48px */
```

### Font Weights
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

---

## 🧩 Component Library

### Buttons

#### Primary Button
```css
.btn-primary {
  background: var(--primary);
  color: var(--text-inverse);
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(45, 125, 125, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  padding: 12px 30px;
  border-radius: 8px;
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--primary);
  color: var(--text-inverse);
}
```

#### Outline Button
```css
.btn-outline {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-medium);
  padding: 12px 24px;
  border-radius: 8px;
}
```

### Cards

#### Product Card
```css
.product-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
}

.product-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.product-card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
}

.product-card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: 8px;
}

.product-card-price {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--primary);
  margin-bottom: 16px;
}
```

#### Info Card
```css
.info-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 32px;
  border-left: 4px solid var(--primary);
}

.info-card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: 12px;
}
```

### Forms

#### Input Field
```css
.form-input {
  width: 100%;
  background: var(--bg-primary);
  border: 2px solid var(--border-light);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: var(--text-base);
  font-family: var(--font-primary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(45, 125, 125, 0.1);
}

.form-input::placeholder {
  color: var(--text-light);
}

.form-input-error {
  border-color: var(--error);
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: 8px;
}
```

#### File Upload
```css
.file-upload {
  border: 2px dashed var(--border-medium);
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  background: var(--bg-tertiary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-upload:hover {
  border-color: var(--primary);
  background: var(--bg-secondary);
}

.file-upload-drag-over {
  border-color: var(--primary);
  background: rgba(45, 125, 125, 0.05);
}
```

### Badges

#### Trust Badge
```css
.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(46, 179, 31, 0.1);
  color: var(--success);
  border-radius: 20px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.trust-badge-icon {
  width: 16px;
  height: 16px;
}
```

### Navigation

#### Header
```css
.header {
  background: var(--bg-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--primary);
}

.nav-menu {
  display: flex;
  gap: 32px;
  list-style: none;
}

.nav-link {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: var(--font-medium);
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--primary);
}
```

### Hero Section

```css
.hero {
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  padding: 80px 24px;
  text-align: center;
}

.hero-title {
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: 24px;
  line-height: var(--leading-tight);
}

.hero-subtitle {
  font-size: var(--text-xl);
  color: var(--text-secondary);
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-cta {
  display: inline-flex;
  gap: 16px;
}
```

### Product Grid

```css
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  padding: 48px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
    padding: 32px 16px;
  }
}
```

### Dashboard Layout

```css
.dashboard {
  display: flex;
  min-height: calc(100vh - 80px);
}

.dashboard-sidebar {
  width: 250px;
  background: var(--bg-secondary);
  padding: 32px 24px;
  border-right: 1px solid var(--border-light);
}

.dashboard-content {
  flex: 1;
  padding: 32px;
  background: var(--bg-primary);
}

.dashboard-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}
```

---

## 📐 Spacing System

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

---

## 🎯 Layout Patterns

### Container
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.container-wide {
  max-width: 1400px;
}

.container-narrow {
  max-width: 800px;
}
```

### Section
```css
.section {
  padding: 80px 24px;
}

.section-title {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  text-align: center;
  color: var(--text-primary);
  margin-bottom: 48px;
}
```

---

## 🎭 Animation & Transitions

```css
/* Standard Transitions */
--transition-fast: 0.15s ease;
--transition-base: 0.3s ease;
--transition-slow: 0.5s ease;

/* Hover Effects */
.hover-lift {
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.6s ease;
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

---

## ✅ Design Checklist

### Homepage
- [ ] Hero section with bold headline
- [ ] Trust badges at top (Blis style)
- [ ] Benefit badges (Cannect style)
- [ ] Product showcase grid
- [ ] CTA buttons prominently placed
- [ ] Clean navigation (Click Cannabis style)

### Product Pages
- [ ] Product cards with hover effects
- [ ] Clear pricing
- [ ] "Add to Cart" buttons
- [ ] Product images with zoom
- [ ] Trust indicators

### User Dashboard
- [ ] Sidebar navigation
- [ ] Dashboard cards
- [ ] Document upload interface
- [ ] Order history
- [ ] Profile management

### Forms
- [ ] Clean input fields
- [ ] File upload with drag & drop
- [ ] Validation states
- [ ] Error messages
- [ ] Success feedback

---

## 🎨 Color Usage Guidelines

### Primary Green (#2d7d7d)
- Main CTAs
- Links
- Brand elements
- Active states

### Background Beige (#f5f3ef)
- Section backgrounds
- Info cards
- Alternating sections

### Accent Gold (#d4a574)
- Highlights
- Premium features
- Special offers

### Status Colors
- Success: Green actions, confirmations
- Warning: Important notices
- Error: Error messages, destructive actions
- Info: Informational messages

---

This design system combines the best elements from all three competitor sites while maintaining a cohesive, professional, and modern aesthetic for EverWell.

