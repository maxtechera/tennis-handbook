#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const INPUT_FILE = path.join(__dirname, '../../docs/lead-magnets/7-day-tennis-workout-plan.md');
const OUTPUT_DIR = path.join(__dirname, '../../public/downloads');
const OUTPUT_FILE = path.join(OUTPUT_DIR, '7-day-elite-tennis-workout.pdf');
const CSS_FILE = path.join(__dirname, 'pdf-styles.css');
const HTML_TEMPLATE = path.join(__dirname, 'pdf-template.html');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Check if input file exists
if (!fs.existsSync(INPUT_FILE)) {
  console.error('❌ Error: Input file not found:', INPUT_FILE);
  process.exit(1);
}

console.log('🎾 Generating Professional Tennis Workout PDF...');
console.log('📄 Source:', INPUT_FILE);
console.log('📁 Output:', OUTPUT_FILE);

// Function to convert markdown to HTML with custom processing
function processMarkdown(content) {
  // Add custom processing for tennis-specific formatting
  let processed = content;
  
  // Replace emoji indicators with styled spans
  processed = processed.replace(/^### (.+)$/gm, '<h3 class="section-header">$1</h3>');
  processed = processed.replace(/\*\*Key Point:\*\*/g, '<span class="key-point">Key Point:</span>');
  processed = processed.replace(/\*\*Tennis Benefit:\*\*/g, '<span class="tennis-benefit">Tennis Benefit:</span>');
  
  // Add page breaks before each day
  processed = processed.replace(/^## Day (\d+):/gm, '<div class="page-break"></div>\n<h2 class="day-header">Day $1:</h2>');
  
  return processed;
}

// Read and process the markdown file
const markdownContent = fs.readFileSync(INPUT_FILE, 'utf-8');
const processedContent = processMarkdown(markdownContent);

// Create HTML template with the content
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>7-Day Elite Tennis Workout Plan</title>
    <link rel="stylesheet" href="${CSS_FILE}">
</head>
<body>
    <div class="pdf-container">
        ${processedContent}
    </div>
</body>
</html>`;

// Write temporary HTML file
const tempHtmlFile = path.join(__dirname, 'temp-workout.html');
fs.writeFileSync(tempHtmlFile, htmlContent);

// Generate PDF using different methods based on availability
try {
  // Method 1: Try using puppeteer if available
  try {
    require.resolve('puppeteer');
    console.log('📊 Using Puppeteer for PDF generation...');
    const generateWithPuppeteer = require('./puppeteer-pdf-generator');
    generateWithPuppeteer(tempHtmlFile, OUTPUT_FILE);
  } catch (e) {
    // Method 2: Try using markdown-pdf if available
    try {
      require.resolve('markdown-pdf');
      console.log('📊 Using markdown-pdf for PDF generation...');
      const markdownPdf = require('markdown-pdf');
      
      const options = {
        cssPath: CSS_FILE,
        paperFormat: 'Letter',
        paperBorder: '0.75in',
        renderDelay: 1000
      };
      
      markdownPdf(options)
        .from(INPUT_FILE)
        .to(OUTPUT_FILE, (err) => {
          if (err) {
            throw err;
          }
          console.log('✅ PDF generated successfully!');
          cleanup();
        });
    } catch (e2) {
      // Method 3: Use wkhtmltopdf or print message
      console.log('📊 Checking for wkhtmltopdf...');
      try {
        execSync('which wkhtmltopdf', { stdio: 'ignore' });
        console.log('Using wkhtmltopdf for PDF generation...');
        execSync(`wkhtmltopdf --enable-local-file-access --page-size Letter --margin-top 0.75in --margin-right 0.75in --margin-bottom 0.75in --margin-left 0.75in "${tempHtmlFile}" "${OUTPUT_FILE}"`);
        console.log('✅ PDF generated successfully!');
        cleanup();
      } catch (e3) {
        console.log('\n⚠️  No PDF generator found. Please install one of the following:');
        console.log('   npm install puppeteer');
        console.log('   npm install markdown-pdf');
        console.log('   brew install wkhtmltopdf (on macOS)');
        console.log('\n📝 HTML file created at:', tempHtmlFile);
        console.log('   You can open this in a browser and print to PDF manually.');
      }
    }
  }
} catch (error) {
  console.error('❌ Error generating PDF:', error.message);
  process.exit(1);
}

function cleanup() {
  // Clean up temporary files
  if (fs.existsSync(tempHtmlFile)) {
    fs.unlinkSync(tempHtmlFile);
  }
  console.log('🎯 PDF saved to:', OUTPUT_FILE);
  console.log('📏 File size:', (fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2), 'MB');
}