# Public Directory Structure

## ✅ Correct Image Structure

All images should be placed in `frontend/public/`:

```
frontend/
└── public/
    ├── images/          # General images, photos, illustrations
    │   └── .gitkeep
    ├── icons/           # Icon files (SVG, PNG)
    │   └── .gitkeep
    └── logos/           # Logo files
        └── .gitkeep
```

## Usage Examples

### In React Components

```jsx
// ✅ Correct - Use public folder
<img src="/images/hero-banner.jpg" alt="Hero" />
<img src="/logos/everwell-logo.png" alt="Logo" />
<img src="/icons/star.svg" alt="Star" />

// ❌ Incorrect - Don't import from assets
// import logo from '../assets/logos/logo.png';
```

### In CSS

```css
/* ✅ Correct */
.hero {
  background-image: url('/images/hero-banner.jpg');
}

/* ❌ Incorrect */
.hero {
  background-image: url('../assets/images/hero-banner.jpg');
}
```

### In HTML (index.html)

```html
<!-- ✅ Correct -->
<link rel="icon" href="/icons/favicon.svg" />
<meta property="og:image" content="/images/og-image.jpg" />
```

## Path Reference

Files in `public/` are served at the root:

| File Location | URL Path |
|--------------|----------|
| `public/images/hero.jpg` | `/images/hero.jpg` |
| `public/icons/star.svg` | `/icons/star.svg` |
| `public/logos/logo.png` | `/logos/logo.png` |

## Migration from src/assets

If you have images in `src/assets/`, move them to `public/`:

1. Move files from `src/assets/images/` → `public/images/`
2. Move files from `src/assets/icons/` → `public/icons/`
3. Move files from `src/assets/logos/` → `public/logos/`
4. Update code references:
   - Change `import logo from '../assets/logos/logo.png'` 
   - To: `<img src="/logos/logo.png" />`

