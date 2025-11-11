# ThoughtSpot Logo Setup

## How to Add the Official ThoughtSpot Logo

1. **Save the official ThoughtSpot logo** from the image provided
2. **Name it**: `thoughtspot-logo.png`
3. **Place it in this folder**: `public/thoughtspot-logo.png`

The app is configured to automatically use the logo once it's placed here.

## Supported Formats
- PNG (recommended)
- JPG
- SVG
- WEBP

## Recommended Specs
- Width: 300px
- Height: 76px (or proportional)
- Transparent background (PNG)
- High resolution for retina displays

## Alternative: Use a Different Filename

If you want to use a different filename or format, update the following file:

**File**: `components/Header.tsx`

Change this line:
```tsx
src="/thoughtspot-logo.png"
```

To your filename:
```tsx
src="/your-logo-name.png"
```

