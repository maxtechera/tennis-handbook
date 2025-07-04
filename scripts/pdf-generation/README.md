# PDF Generation for 7-Day Tennis Workout Lead Magnet

This directory contains scripts to generate a professional PDF from the markdown workout plan.

## Quick Start

```bash
# Generate HTML version (opens in browser automatically)
npm run generate-html

# Then in your browser:
# 1. Click "Save as PDF" button
# 2. Or press Ctrl/Cmd + P
# 3. Ensure "Background graphics" is ON
# 4. Save as PDF
```

## Files

- `simple-html-generator.js` - Main script that converts Markdown to styled HTML
- `markdown-pdf-generator.js` - Alternative generator with fallback options
- `simple-pdf-generator.js` - Puppeteer-based generator (requires Chrome)
- `pdf-styles.css` - Professional CSS styling for PDF output

## Features

✅ Professional typography and layout
✅ Print-optimized styling
✅ Page breaks at logical sections
✅ Color-coded exercise categories
✅ Highlighted key points and benefits
✅ Mobile-responsive HTML preview
✅ One-click PDF generation

## Output

Generated files are saved to:
- HTML: `/public/downloads/7-day-elite-tennis-workout.html`
- PDF: Save from browser to desired location

## Customization

To modify the styling, edit the CSS in `simple-html-generator.js`:
- Colors: Search for color hex codes
- Fonts: Modify the font-family declarations
- Layout: Adjust margins and padding values
- Page breaks: Modify `page-break-*` properties

## Troubleshooting

If the HTML doesn't open automatically:
1. Navigate to `public/downloads/`
2. Open `7-day-elite-tennis-workout.html` in Chrome or Edge
3. Follow the on-screen instructions

For best PDF quality:
- Use Chrome or Edge browser
- Enable "Background graphics" in print settings
- Use "Letter" page size
- Keep default margins or set to "None" for full design