#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configuration
const INPUT_FILE = path.join(__dirname, '../../docs/lead-magnets/7-day-tennis-workout-plan.md');
const OUTPUT_DIR = path.join(__dirname, '../../public/downloads');
const OUTPUT_HTML = path.join(OUTPUT_DIR, '7-day-elite-tennis-workout.html');
const OUTPUT_PDF = path.join(OUTPUT_DIR, '7-day-elite-tennis-workout.pdf');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🎾 Generating Tennis Workout PDF...');

// Read markdown content
const markdown = fs.readFileSync(INPUT_FILE, 'utf-8');

// Configure marked for better output
marked.setOptions({
  breaks: true,
  gfm: true
});

// Convert markdown to HTML with custom rendering
const renderer = new marked.Renderer();

// Custom heading rendering
renderer.heading = function(text, level) {
  const textStr = String(text || '');
  const escapedText = textStr.toLowerCase().replace(/[^\w]+/g, '-');
  return `<h${level} id="${escapedText}" class="heading-level-${level}">${textStr}</h${level}>`;
};

// Custom list rendering
renderer.listitem = function(text) {
  // Check for special formatting
  if (text.includes('Key Point:')) {
    return `<li class="key-point">${text}</li>`;
  }
  if (text.includes('Tennis Benefit:')) {
    return `<li class="tennis-benefit">${text}</li>`;
  }
  return `<li>${text}</li>`;
};

// Convert markdown to HTML
const htmlContent = marked(markdown, { renderer });

// Create professional HTML document
const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>7-Day Elite Tennis Workout Plan</title>
    <style>
        /* Professional Print-Ready Styles */
        @page {
            size: letter;
            margin: 1in;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #2C3E50;
            background: white;
        }
        
        .container {
            max-width: 100%;
            margin: 0 auto;
        }
        
        /* Headers */
        h1 {
            color: #1B5E20;
            font-size: 32pt;
            text-align: center;
            margin-bottom: 12pt;
            padding-bottom: 12pt;
            border-bottom: 4px solid #66BB6A;
            font-weight: 700;
            letter-spacing: -0.5pt;
        }
        
        h1 + p {
            text-align: center;
            color: #558B2F;
            font-style: italic;
            font-size: 14pt;
            margin-bottom: 24pt;
            font-weight: 500;
        }
        
        h2 {
            color: #2E7D32;
            font-size: 20pt;
            margin-top: 36pt;
            margin-bottom: 18pt;
            padding: 12pt 16pt;
            background: linear-gradient(to right, #E8F5E9, rgba(232, 245, 233, 0));
            border-left: 5px solid #66BB6A;
            page-break-before: always;
            page-break-after: avoid;
            font-weight: 600;
        }
        
        h2:first-of-type {
            page-break-before: avoid;
            margin-top: 0;
        }
        
        h3 {
            color: #388E3C;
            font-size: 16pt;
            margin-top: 24pt;
            margin-bottom: 12pt;
            font-weight: 600;
            page-break-after: avoid;
        }
        
        h4 {
            color: #43A047;
            font-size: 13pt;
            margin-top: 18pt;
            margin-bottom: 8pt;
            padding: 6pt 12pt;
            background: #F1F8E9;
            border-left: 3px solid #81C784;
            font-weight: 600;
            page-break-after: avoid;
        }
        
        /* Content */
        p {
            margin-bottom: 12pt;
            text-align: justify;
            orphans: 3;
            widows: 3;
        }
        
        ul, ol {
            margin-left: 24pt;
            margin-bottom: 12pt;
        }
        
        li {
            margin-bottom: 6pt;
        }
        
        li strong:first-child {
            color: #1B5E20;
            font-weight: 600;
        }
        
        /* Special formatting */
        .key-point strong {
            color: #E65100;
        }
        
        .tennis-benefit strong {
            color: #1565C0;
        }
        
        /* Exercise blocks */
        h4 + ul {
            background: #FAFAFA;
            padding: 12pt;
            border-radius: 6pt;
            border: 1px solid #E0E0E0;
            margin-bottom: 18pt;
            page-break-inside: avoid;
        }
        
        /* Section backgrounds */
        h3:contains("Warm-Up"),
        h3.heading-level-3[id*="warm-up"] {
            background: linear-gradient(90deg, #66BB6A 0%, #81C784 100%);
            color: white;
            padding: 8pt 16pt;
            border-radius: 6pt;
            margin-top: 24pt;
        }
        
        hr {
            border: none;
            border-top: 2px solid #E0E0E0;
            margin: 24pt 0;
            page-break-after: avoid;
        }
        
        /* Day headers */
        h2[id*="day-"] {
            background: #E8F5E9;
            border-radius: 8pt;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        /* Pro tips */
        h3[id*="alcaraz"],
        h3[id*="sinner"] {
            background: #FFF3E0;
            padding: 12pt;
            border-radius: 8pt;
            color: #E65100;
            border-left: 4px solid #FF6F00;
        }
        
        /* Assessment section */
        h3[id*="review"] + ul,
        h3[id*="plan"] + ul {
            background: #F3E5F5;
            padding: 12pt 12pt 12pt 36pt;
            border-radius: 6pt;
            border-left: 4px solid #AB47BC;
        }
        
        /* Print optimization */
        @media print {
            body {
                font-size: 10pt;
            }
            
            h1 { font-size: 28pt; }
            h2 { font-size: 18pt; }
            h3 { font-size: 14pt; }
            h4 { font-size: 12pt; }
            
            /* Ensure backgrounds print */
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* Avoid breaking inside exercise blocks */
            ul, ol {
                page-break-inside: avoid;
            }
            
            /* Add page numbers */
            @page {
                @bottom-center {
                    content: counter(page) " of " counter(pages);
                    font-size: 9pt;
                    color: #666;
                }
            }
        }
        
        /* Footer */
        body > p:last-child {
            text-align: center;
            color: #666;
            font-size: 9pt;
            margin-top: 36pt;
            padding-top: 24pt;
            border-top: 1px solid #E0E0E0;
        }
    </style>
</head>
<body>
    <div class="container">
        ${htmlContent}
    </div>
    
    <script>
        // Add print instructions
        if (window.location.protocol === 'file:') {
            const instructions = document.createElement('div');
            instructions.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); font-size: 14px; z-index: 1000;';
            instructions.innerHTML = '<strong>To save as PDF:</strong><br>Press Ctrl/Cmd + P → Save as PDF';
            document.body.appendChild(instructions);
            
            setTimeout(() => {
                instructions.style.display = 'none';
            }, 10000);
        }
    </script>
</body>
</html>`;

// Write HTML file
fs.writeFileSync(OUTPUT_HTML, fullHTML);
console.log('✅ HTML file generated:', OUTPUT_HTML);

// Try to generate PDF using available methods
const { exec } = require('child_process');

// Check for wkhtmltopdf
exec('which wkhtmltopdf', (error, stdout) => {
  if (!error && stdout.trim()) {
    console.log('📄 Generating PDF with wkhtmltopdf...');
    exec(`wkhtmltopdf --enable-local-file-access --print-media-type --page-size Letter --margin-top 1in --margin-right 1in --margin-bottom 1in --margin-left 1in "${OUTPUT_HTML}" "${OUTPUT_PDF}"`, (err) => {
      if (err) {
        console.error('❌ Error with wkhtmltopdf:', err.message);
        printAlternatives();
      } else {
        console.log('✅ PDF generated successfully!');
        console.log('📄 Output:', OUTPUT_PDF);
        console.log('📏 Size:', (fs.statSync(OUTPUT_PDF).size / 1024 / 1024).toFixed(2), 'MB');
      }
    });
  } else {
    // Check for prince
    exec('which prince', (error2, stdout2) => {
      if (!error2 && stdout2.trim()) {
        console.log('📄 Generating PDF with Prince...');
        exec(`prince "${OUTPUT_HTML}" -o "${OUTPUT_PDF}"`, (err) => {
          if (err) {
            console.error('❌ Error with Prince:', err.message);
            printAlternatives();
          } else {
            console.log('✅ PDF generated successfully!');
            console.log('📄 Output:', OUTPUT_PDF);
          }
        });
      } else {
        printAlternatives();
      }
    });
  }
});

function printAlternatives() {
  console.log('\n📋 HTML file has been generated successfully!');
  console.log('   Location:', OUTPUT_HTML);
  console.log('\n🖨️  To convert to PDF, you have several options:\n');
  console.log('   Option 1: Open the HTML file in a browser and print to PDF');
  console.log('   - Open:', OUTPUT_HTML);
  console.log('   - Press Ctrl/Cmd + P');
  console.log('   - Select "Save as PDF"\n');
  console.log('   Option 2: Install a PDF converter');
  console.log('   - macOS: brew install wkhtmltopdf');
  console.log('   - Ubuntu: sudo apt-get install wkhtmltopdf');
  console.log('   - Then run: npm run generate-pdf\n');
  console.log('   Option 3: Use an online converter');
  console.log('   - Upload the HTML file to any online HTML-to-PDF converter\n');
}