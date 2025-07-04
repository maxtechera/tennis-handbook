const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF(htmlFile, outputFile) {
  console.log('🚀 Launching Puppeteer...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Load the HTML file
  const htmlContent = fs.readFileSync(htmlFile, 'utf-8');
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  // Generate PDF with professional settings
  await page.pdf({
    path: outputFile,
    format: 'Letter',
    margin: {
      top: '0.75in',
      right: '0.75in',
      bottom: '0.75in',
      left: '0.75in'
    },
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="width: 100%; font-size: 9px; padding: 5px 0; text-align: center; color: #666;">
        <span>7-Day Elite Tennis Workout Plan</span>
      </div>
    `,
    footerTemplate: `
      <div style="width: 100%; font-size: 9px; padding: 5px 0; text-align: center; color: #666;">
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `
  });
  
  await browser.close();
  console.log('✅ PDF generated with Puppeteer!');
}

module.exports = generatePDF;