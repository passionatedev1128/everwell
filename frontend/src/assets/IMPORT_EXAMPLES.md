# Image Import Examples

## How to Import and Use Images in Components

### Example 1: Importing a Logo

```javascript
// In your component file (e.g., Header.jsx)
import logo from '../assets/logos/everwell-logo.png';

function Header() {
  return (
    <img src={logo} alt="EverWell Logo" className="w-32 h-32" />
  );
}
```

### Example 2: Importing an Icon

```javascript
// In your component file
import starIcon from '../assets/icons/star.svg';

function Rating() {
  return (
    <img src={starIcon} alt="Star" className="w-5 h-5" />
  );
}
```

### Example 3: Importing a Background Image

```javascript
// In your component file
import heroImage from '../assets/images/hero-banner.jpg';

function Hero() {
  return (
    <div 
      style={{ backgroundImage: `url(${heroImage})` }}
      className="hero-section"
    >
      {/* Content */}
    </div>
  );
}
```

### Example 4: Using Images in CSS

```css
/* In your CSS file (e.g., index.css) */
.hero-banner {
  background-image: url('../assets/images/hero-banner.jpg');
  background-size: cover;
  background-position: center;
}
```

### Example 5: Dynamic Image Imports

```javascript
// For dynamic imports (lazy loading)
function ProductCard({ productId }) {
  const [image, setImage] = useState(null);
  
  useEffect(() => {
    import(`../assets/images/product-${productId}.jpg`)
      .then(img => setImage(img.default))
      .catch(() => setImage(null));
  }, [productId]);
  
  return image ? <img src={image} alt="Product" /> : <div>Loading...</div>;
}
```

## Notes

- Vite automatically processes image imports and optimizes them
- Imported images get a hashed filename in production for cache busting
- Use relative paths from your component file to the assets folder
- For SVG files, you can also import them as React components if using `vite-plugin-svgr`

