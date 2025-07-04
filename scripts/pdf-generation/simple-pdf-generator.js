#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const puppeteer = require('puppeteer');

// Configuration
const INPUT_FILE = path.join(__dirname, '../../docs/lead-magnets/7-day-tennis-workout-plan.md');
const OUTPUT_DIR = path.join(__dirname, '../../public/downloads');
const OUTPUT_FILE = path.join(OUTPUT_DIR, '7-day-elite-tennis-workout.pdf');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generatePDF() {
  try {
    console.log('🎾 Starting PDF generation...');
    
    // Read markdown content
    const markdown = fs.readFileSync(INPUT_FILE, 'utf-8');
    
    // Convert markdown to HTML
    const htmlContent = marked(markdown);
    
    // Create full HTML document with styling
    const fullHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
            font-family: 'Inter', -apple-system, sans-serif;
            line-height: 1.6;
            color: #2C3E50;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        
        h1 {
            color: #1B5E20;
            font-size: 2.5em;
            text-align: center;
            margin-bottom: 0.5em;
            padding-bottom: 0.5em;
            border-bottom: 4px solid #66BB6A;
        }
        
        h1 + p {
            text-align: center;
            color: #558B2F;
            font-style: italic;
            font-size: 1.2em;
            margin-bottom: 2em;
        }
        
        h2 {
            color: #2E7D32;
            font-size: 2em;
            margin-top: 1.5em;
            padding: 0.5em;
            background: linear-gradient(to right, #E8F5E9, transparent);
            border-left: 5px solid #66BB6A;
            page-break-before: always;
        }
        
        h2:first-of-type {
            page-break-before: avoid;
        }
        
        h3 {
            color: #388E3C;
            font-size: 1.5em;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        
        h4 {
            color: #43A047;
            font-size: 1.2em;
            margin-top: 1em;
            margin-bottom: 0.5em;
            padding: 0.3em 0.5em;
            background: #F1F8E9;
            border-left: 3px solid #81C784;
        }
        
        ul, ol {
            margin-left: 2em;
            margin-bottom: 1em;
        }
        
        li {
            margin-bottom: 0.5em;
        }
        
        li strong:first-child {
            color: #1B5E20;
        }
        
        /* Exercise formatting */
        h4 + ul {
            background: #FAFAFA;
            padding: 1em;
            border-radius: 8px;
            border: 1px solid #E0E0E0;
            margin-bottom: 1.5em;
        }
        
        /* Key points and benefits */
        strong:contains("Key Point:") {
            color: #E65100;
        }
        
        strong:contains("Tennis Benefit:") {
            color: #1565C0;
        }
        
        blockquote {
            background: #E3F2FD;
            border-left: 4px solid #1976D2;
            padding: 1em;
            margin: 1em 0;
            font-style: italic;
        }
        
        hr {
            border: none;
            border-top: 2px solid #E0E0E0;
            margin: 2em 0;
        }
        
        /* Pro tips */
        h3:contains("Alcaraz"),
        h3:contains("Sinner") {
            background: #FFF3E0;
            padding: 0.5em;
            border-radius: 8px;
            color: #E65100;
        }
        
        /* Print optimization */
        @media print {
            body {
                font-size: 11pt;
                padding: 0;
            }
            
            h2 {
                page-break-before: always;
                page-break-after: avoid;
            }
            
            h3, h4 {
                page-break-after: avoid;
            }
            
            ul, ol {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set content
    await page.setContent(fullHTML, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    await page.pdf({
      path: OUTPUT_FILE,
      format: 'Letter',
      margin: {
        top: '1in',
        right: '1in',
        bottom: '1in',
        left: '1in'
      },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="width: 100%; text-align: center; font-size: 10px; color: #666; padding-top: 20px;">
          <span>7-Day Elite Tennis Workout Plan</span>
        </div>
      `,
      footerTemplate: `
        <div style="width: 100%; text-align: center; font-size: 10px; color: #666; padding-bottom: 20px;">
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span> | TennisPerformanceHandbook.com</span>
        </div>
      `
    });
    
    await browser.close();
    
    console.log('✅ PDF generated successfully!');
    console.log('📄 Output:', OUTPUT_FILE);
    console.log('📏 Size:', (fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2), 'MB');
    
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  }
}

// Check if required packages are installed
try {
  require.resolve('marked');
  require.resolve('puppeteer');
} catch (e) {
  console.log('📦 Installing required packages...');
  require('child_process').execSync('npm install marked puppeteer', { stdio: 'inherit' });
}

// Run the generator
generatePDF();