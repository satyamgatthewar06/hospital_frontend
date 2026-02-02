const puppeteer = require('puppeteer');

(async () => {
  const results = [];
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] });
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(20000);

    const base = process.env.SMOKE_BASE || 'http://localhost:3000';
    const delay = (ms) => new Promise(r => setTimeout(r, ms));

    // 1) Home + Theme toggle
    console.log('🧪 Testing Dark Mode toggle...');
    await page.goto(base, { waitUntil: 'networkidle2' });
    await delay(1000);
    
    try {
      const hasThemeBtn = await page.evaluate(() => {
        const btn = document.querySelector('.theme-toggle');
        return !!btn;
      });
      
      if (hasThemeBtn) {
        await page.click('.theme-toggle');
        await delay(500);
        results.push({ step: 'theme-toggle', ok: true, note: 'Dark Mode toggle clicked successfully' });
      } else {
        results.push({ step: 'theme-toggle', ok: false, note: 'Theme toggle button not found' });
      }
    } catch (e) {
      results.push({ step: 'theme-toggle', ok: false, note: 'Error: ' + e.message });
    }

    // 2) Analytics route
    console.log('🧪 Testing Analytics route...');
    await page.goto(base + '/analytics', { waitUntil: 'networkidle2' });
    await delay(1000);
    
    try {
      const title = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        return h1 ? h1.textContent.trim() : '';
      });
      
      const hasCharts = await page.evaluate(() => {
        const charts = document.querySelectorAll('[class*="chart"], [class*="recharts"], svg');
        return charts.length > 0;
      });
      
      results.push({ 
        step: 'analytics', 
        ok: !!title && hasCharts, 
        note: `Analytics page loaded${title ? ` (${title})` : ''}${hasCharts ? ' with charts' : ' (no charts found)'}` 
      });
    } catch (e) {
      results.push({ step: 'analytics', ok: false, note: 'Error: ' + e.message });
    }

    // 3) Billing Actions (PDF/CSV/Backup buttons)
    console.log('🧪 Testing Billing Actions (PDF/CSV/Backup)...');
    await page.goto(base + '/billing', { waitUntil: 'networkidle2' });
    await delay(1000);

    // Check for PDF download button
    try {
      const hasPdfBtn = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.some(btn => btn.textContent.includes('PDF') || btn.textContent.includes('Download'));
      });
      results.push({ step: 'download-pdf-button', ok: hasPdfBtn, note: hasPdfBtn ? 'PDF download button found' : 'PDF button not found on billing page' });
    } catch (e) {
      results.push({ step: 'download-pdf-button', ok: false, note: 'Error: ' + e.message });
    }

    // Check for CSV export button
    try {
      const hasCsvBtn = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.some(btn => btn.textContent.includes('CSV') || btn.textContent.includes('Export'));
      });
      results.push({ step: 'export-csv-button', ok: hasCsvBtn, note: hasCsvBtn ? 'CSV export button found' : 'CSV button not found on billing page' });
    } catch (e) {
      results.push({ step: 'export-csv-button', ok: false, note: 'Error: ' + e.message });
    }

    // Check for Backup button
    try {
      const hasBackupBtn = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.some(btn => btn.textContent.includes('Backup') || btn.textContent.includes('backup'));
      });
      results.push({ step: 'backup-button', ok: hasBackupBtn, note: hasBackupBtn ? 'Backup button found' : 'Backup button not found on billing page' });
    } catch (e) {
      results.push({ step: 'backup-button', ok: false, note: 'Error: ' + e.message });
    }

    // Take screenshot
    console.log('📸 Capturing final screenshot...');
    await page.screenshot({ path: 'tests/smoke-end.png', fullPage: false });

    const passed = results.filter(r => r.ok).length;
    const total = results.length;
    console.log(`\n✅ Smoke Test Results: ${passed}/${total} passed\n`);
    console.log(JSON.stringify({ success: passed === total, results, summary: `${passed}/${total} tests passed` }, null, 2));
    
  } catch (err) {
    console.error(JSON.stringify({ success: false, error: err.message }, null, 2));
  } finally {
    await browser.close();
  }
})();
