#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configuration
const INPUT_FILE = path.join(__dirname, '../../docs/lead-magnets/7-day-tennis-workout-plan.md');
const OUTPUT_DIR = path.join(__dirname, '../../public/downloads');
const OUTPUT_HTML = path.join(OUTPUT_DIR, '7-day-elite-tennis-workout.html');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🎾 Generating Professional Tennis Workout HTML...');

// Read markdown content
const markdown = fs.readFileSync(INPUT_FILE, 'utf-8');

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true
});

// Convert markdown to HTML
const htmlContent = marked.parse(markdown);

// Create professional HTML document
const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>7-Day Elite Tennis Workout Plan</title>
    <style>
        /* Professional Print-Ready Styles */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        @page {
            size: letter;
            margin: 0.75in 1in;
        }
        
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 11pt;
            line-height: 1.7;
            color: #2C3E50;
            background: white;
            margin: 0;
            padding: 40px;
            max-width: 8.5in;
            margin: 0 auto;
        }
        
        /* Typography */
        h1 {
            color: #1B5E20;
            font-size: 36pt;
            text-align: center;
            margin-bottom: 16pt;
            font-weight: 800;
            letter-spacing: -1pt;
            padding-bottom: 16pt;
            border-bottom: 4px solid #66BB6A;
        }
        
        h1 + p {
            text-align: center;
            color: #558B2F;
            font-style: italic;
            font-size: 16pt;
            margin-bottom: 32pt;
            font-weight: 500;
        }
        
        h2 {
            color: #2E7D32;
            font-size: 24pt;
            margin-top: 48pt;
            margin-bottom: 24pt;
            padding: 16pt 20pt;
            background: linear-gradient(to right, #E8F5E9, rgba(232, 245, 233, 0));
            border-left: 6px solid #66BB6A;
            page-break-before: always;
            page-break-after: avoid;
            font-weight: 700;
        }
        
        h2:first-of-type {
            page-break-before: avoid;
            margin-top: 0;
        }
        
        h3 {
            color: #388E3C;
            font-size: 18pt;
            margin-top: 32pt;
            margin-bottom: 16pt;
            font-weight: 600;
            page-break-after: avoid;
        }
        
        h4 {
            color: #43A047;
            font-size: 14pt;
            margin-top: 24pt;
            margin-bottom: 12pt;
            padding: 8pt 16pt;
            background: #F1F8E9;
            border-left: 4px solid #81C784;
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
            margin-bottom: 16pt;
            padding-left: 12pt;
        }
        
        li {
            margin-bottom: 8pt;
            line-height: 1.6;
        }
        
        li strong:first-child {
            color: #1B5E20;
            font-weight: 600;
        }
        
        /* Special formatting */
        li strong:contains("Key Point") {
            color: #E65100 !important;
        }
        
        li strong:contains("Tennis Benefit") {
            color: #1565C0 !important;
        }
        
        /* Exercise blocks */
        h4 + ul {
            background: #FAFAFA;
            padding: 16pt;
            border-radius: 8pt;
            border: 1px solid #E0E0E0;
            margin-bottom: 24pt;
            page-break-inside: avoid;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        /* Section backgrounds */
        h3:contains("Warm-Up"),
        h3:contains("Main Workout"),
        h3:contains("Cool-Down") {
            background: linear-gradient(135deg, #66BB6A 0%, #81C784 100%);
            color: white;
            padding: 12pt 20pt;
            border-radius: 8pt;
            margin-top: 32pt;
            text-align: center;
            font-weight: 700;
        }
        
        /* Horizontal rules */
        hr {
            border: none;
            border-top: 3px solid #E0E0E0;
            margin: 40pt 0;
            page-break-after: avoid;
        }
        
        /* Pro tips section */
        h2:contains("Bonus Tips") {
            background: linear-gradient(to right, #FFF3E0, rgba(255, 243, 224, 0));
            color: #E65100;
            border-left-color: #FF6F00;
        }
        
        h3:contains("Alcaraz"),
        h3:contains("Sinner") {
            background: #FFF3E0;
            padding: 16pt;
            border-radius: 8pt;
            color: #E65100;
            border-left: 4px solid #FF6F00;
            margin: 24pt 0;
        }
        
        /* Assessment sections */
        h3:contains("Review"),
        h3:contains("Plan") {
            background: #F3E5F5;
            padding: 12pt 20pt;
            border-radius: 8pt;
            color: #6A1B9A;
            border-left: 4px solid #AB47BC;
        }
        
        /* Nutrition section */
        h3:contains("Nutrition") {
            background: #FFF8E1;
            padding: 12pt 20pt;
            border-radius: 8pt;
            color: #F57C00;
            border-left: 4px solid #FFB300;
        }
        
        /* CTA sections */
        h2:contains("Your Next Steps") {
            background: #1B5E20;
            color: white;
            text-align: center;
            padding: 24pt;
            border-radius: 12pt;
            margin-top: 48pt;
            border: none;
        }
        
        h2:contains("Your Next Steps") + ol {
            background: #E8F5E9;
            padding: 24pt 24pt 24pt 48pt;
            border-radius: 12pt;
            font-size: 13pt;
            font-weight: 500;
            margin-top: -12pt;
        }
        
        /* Print optimization */
        @media print {
            body {
                padding: 0;
                font-size: 10pt;
            }
            
            h1 { font-size: 32pt; }
            h2 { font-size: 20pt; }
            h3 { font-size: 16pt; }
            h4 { font-size: 13pt; }
            
            /* Ensure backgrounds print */
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            
            /* Page numbers */
            @page {
                @bottom-center {
                    content: counter(page) " of " counter(pages);
                    font-size: 9pt;
                    color: #666;
                }
                
                @top-center {
                    content: "7-Day Elite Tennis Workout Plan";
                    font-size: 9pt;
                    color: #666;
                }
            }
        }
        
        /* Print button */
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
        }
        
        .print-button:hover {
            background: #45a049;
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0,0,0,0.15);
        }
        
        @media print {
            .print-button {
                display: none;
            }
        }
    </style>
</head>
<body>
    <button class="print-button" onclick="window.print()">📄 Save as PDF</button>
    
    <div class="content">
        ${htmlContent}
    </div>
    
    <script>
        // Auto-hide print button after 10 seconds
        setTimeout(() => {
            const btn = document.querySelector('.print-button');
            if (btn) {
                btn.style.opacity = '0.7';
            }
        }, 10000);
        
        // Show print instructions if opened directly
        if (window.location.protocol === 'file:') {
            const instructions = document.createElement('div');
            instructions.style.cssText = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #2196F3; color: white; padding: 16px 24px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); font-size: 14px; z-index: 1000; text-align: center;';
            instructions.innerHTML = '<strong>💡 Pro Tip:</strong> For best results, use Chrome or Edge browser<br>Print settings: Letter size, Default margins, Background graphics ON';
            document.body.appendChild(instructions);
            
            setTimeout(() => {
                instructions.style.display = 'none';
            }, 15000);
        }
    </script>
</body>
</html>`;

// Write HTML file
fs.writeFileSync(OUTPUT_HTML, fullHTML);

console.log('✅ Professional HTML file generated successfully!');
console.log('📄 Output file:', OUTPUT_HTML);
console.log('📏 File size:', (fs.statSync(OUTPUT_HTML).size / 1024).toFixed(2), 'KB');
console.log('\n🖨️  To create PDF:');
console.log('   1. Open the HTML file in Chrome or Edge');
console.log('   2. Click the "Save as PDF" button or press Ctrl/Cmd + P');
console.log('   3. Ensure "Background graphics" is checked in print settings');
console.log('   4. Save as PDF\n');

// Open the file in the default browser if possible
const platform = process.platform;
const { exec } = require('child_process');

if (platform === 'darwin') {
  exec(`open "${OUTPUT_HTML}"`);
  console.log('🌐 Opening in default browser...');
} else if (platform === 'win32') {
  exec(`start "${OUTPUT_HTML}"`);
  console.log('🌐 Opening in default browser...');
} else {
  console.log('📁 Please open the file manually in your browser');
}