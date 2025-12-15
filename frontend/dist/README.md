# Public Assets Directory

This directory contains static assets that are served directly by the web server. Files placed here are accessible via URL paths.

## Folder Structure

```
public/
├── images/          # General images, photos, illustrations
├── icons/           # Icon files (SVG, PNG)
└── logos/           # Logo files
```

## Usage

### In React Components (JSX)

Files in the `public` folder are served at the root URL:

```javascript
// Access images directly via URL path
<img src="/images/hero-banner.jpg" alt="Hero Banner" />
<img src="/logos/everwell-logo.png" alt="EverWell Logo" />
<img src="/icons/star.svg" alt="Star Icon" />

// Or use process.env.PUBLIC_URL in production
<img src={`${process.env.PUBLIC_URL}/images/hero-banner.jpg`} alt="Hero Banner" />
```

### In CSS

```css
/* In your CSS file */
.hero-banner {
  background-image: url('/images/hero-banner.jpg');
}

.logo {
  background-image: url('/logos/everwell-logo.png');
}
```

### In HTML (index.html)

```html
<link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
```

## Path Mapping

Files in `public/` are served at the root URL:

- `public/images/logo.png` → `/images/logo.png`
- `public/icons/star.svg` → `/icons/star.svg`
- `public/logos/everwell-logo.png` → `/logos/everwell-logo.png`

## When to Use Public vs src/assets

### Use `public/` for:
- ✅ Large images that don't need bundling
- ✅ Images referenced in HTML (meta tags, favicons)
- ✅ Images that need to be accessible via direct URL
- ✅ Images that change frequently without code changes
- ✅ External references (Open Graph images, etc.)

### Use `src/assets/` for:
- ✅ Small images that benefit from bundling
- ✅ Images imported in JavaScript/TypeScript
- ✅ Images that need optimization during build
- ✅ Images that are part of component logic

## Best Practices

1. **Optimize Images**: Compress images before adding them
2. **Use Appropriate Formats**:
   - SVG for icons and logos (scalable, small file size)
   - WebP for photos (better compression)
   - PNG for images with transparency
   - JPG for photos without transparency
3. **Naming Conventions**: Use kebab-case (e.g., `hero-banner.jpg`, `user-icon.svg`)
4. **Organization**: Group related images in subfolders
5. **File Size**: Keep individual files under 500KB when possible

## Image Optimization Tools

- [TinyPNG](https://tinypng.com/) - Compress PNG and JPG images
- [Squoosh](https://squoosh.app/) - Image compression and format conversion
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - Optimize SVG files

