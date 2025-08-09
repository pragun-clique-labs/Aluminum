# Custom Fonts Guide

## How to Add Custom Fonts

1. **Place your font files** in this directory (`public/fonts/`)
   - Supported formats: `.woff2`, `.woff`, `.ttf`, `.otf`
   - For best performance, use `.woff2` format (most modern and compressed)

2. **Update the CSS** in `src/index.css`:
   ```css
   @font-face {
     font-family: 'YourFontName';
     src: url('/fonts/YourFont.woff2') format('woff2'),
          url('/fonts/YourFont.woff') format('woff'),
          url('/fonts/YourFont.ttf') format('truetype');
     font-weight: normal;
     font-style: normal;
     font-display: swap;
   }
   ```

3. **Add to Tailwind config** in `tailwind.config.js`:
   ```js
   fontFamily: {
     'your-font': ['YourFontName', 'fallback-font'],
   }
   ```

4. **Use in your components**:
   ```jsx
   <div className="font-your-font">Text with custom font</div>
   ```

## Font Loading Best Practices

- Use `font-display: swap` for better loading performance
- Always provide fallback fonts
- Optimize font files for web (subset characters if possible)
- Use preload in HTML for critical fonts:
  ```html
  <link rel="preload" href="/fonts/YourFont.woff2" as="font" type="font/woff2" crossorigin>
  ```

## Current Font Setup

The app currently supports:
- `font-custom` - Maps to 'CustomFont' family
- `font-custom-serif` - Maps to 'CustomSerifFont' family

Update the font names in both `index.css` and `tailwind.config.js` to match your actual font files.
