# Frontend Assets

This folder contains all static assets used in the frontend application.

## Folder Structure

```
assets/
├── images/          # General images, photos, illustrations
├── icons/           # Icon files (SVG, PNG)
└── logos/           # Logo files
```

## Usage

### Importing Images

```javascript
// Example: Import an image
import logo from '../assets/logos/everwell-logo.png';
import heroImage from '../assets/images/hero-banner.jpg';
import starIcon from '../assets/icons/star.svg';

// Use in JSX
<img src={logo} alt="EverWell Logo" />
```

### Using Images in CSS

```css
/* In your CSS file */
.hero-banner {
  background-image: url('../assets/images/hero-banner.jpg');
}
```

### Public Assets (Alternative)

For assets that need to be referenced by URL (e.g., in HTML or external references), you can also place them in the `public` folder at the root of the frontend directory:

```
frontend/
└── public/
    └── images/
        └── favicon.ico
```

Files in the `public` folder are served at the root URL:
- `public/images/logo.png` → `/images/logo.png`

## Best Practices

1. **Optimize Images**: Compress images before adding them to reduce bundle size
2. **Use Appropriate Formats**:
   - Use SVG for icons and logos (scalable, small file size)
   - Use WebP for photos (better compression)
   - Use PNG for images with transparency
   - Use JPG for photos without transparency
3. **Naming Conventions**: Use kebab-case for file names (e.g., `hero-banner.jpg`, `user-icon.svg`)
4. **Organization**: Group related images in subfolders if needed
5. **File Size**: Keep individual image files under 500KB when possible

## Image Optimization Tools

- [TinyPNG](https://tinypng.com/) - Compress PNG and JPG images
- [Squoosh](https://squoosh.app/) - Image compression and format conversion
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - Optimize SVG files

