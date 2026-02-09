const puppeteer = require('puppeteer');

(async () => {
    // Launch browser (headless for CI/CD or server environments)
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox']
    });

    console.log("🚀 Starting Puppeteer Automation Test for Login...");

    try {
        const page = await browser.newPage();

        // Listen to console logs
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));

        // 1. Navigate to Login Page
        await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle0' });

        // ----------------------------------------------------------------
        // Test Case 1: Check Elements
        // ----------------------------------------------------------------
        const roleSelect = await page.$('select');
        const userInput = await page.$('input[type="text"]');
        const passInput = await page.$('input[type="password"]');

        if (roleSelect && userInput && passInput) {
            console.log("✅ PASS: Login form elements found (Role, Username, Password)");
        } else {
            console.error("❌ FAIL: Some form elements are missing");
        }

        // ----------------------------------------------------------------
        // Test Case 2: Admin Login
        // ----------------------------------------------------------------
        console.log("\n🧪 [Test 2] Attempting Admin Login...");

        // Select 'ADMIN' (it's the first option usually, but let's be explicit if possible or just rely on default)
        await page.select('select', 'ADMIN');

        // Type credentials
        await page.type('input[type="text"]', 'admin');
        await page.type('input[type="password"]', 'admin123');

        // Click Login
        await page.click('button[type="submit"]');

        // Wait for URL to change to dashboard (SPA navigation) or timeout
        // Increase timeout to 40s in case backend is slow (axios timeout is 30s)
        try {
            await page.waitForFunction(
                () => window.location.href.includes('admin-dashboard'),
                { timeout: 40000 }
            );
            console.log("✅ PASS: Admin Login Redirected to Dashboard");
        } catch (e) {
            console.error(`❌ FAIL: URL did not change to admin-dashboard within timeout. Current URL: ${page.url()}`);

            // Log button text to see if it's stuck loading
            const btnText = await page.evaluate(() => {
                const btn = document.querySelector('button[type="submit"]');
                return btn ? btn.innerText : 'Button not found';
            });
            console.log(`Debug - Button Text: ${btnText}`);

            // Log any error text on the page
            const errorText = await page.evaluate(() => {
                const errEl = document.querySelector('.login-error');
                return errEl ? errEl.innerText : 'No error message found';
            });
            console.log(`Debug - On-page Error: ${errorText}`);
        }

        // ----------------------------------------------------------------
        // Test Case 3: Role Mismatch (Need to logout first or use new page)
        // ----------------------------------------------------------------
        // For simplicity in this script, we'll confirm the positive case works.
        // To test mismatch, we'd need to clear cookies or logout.

    } catch (error) {
        console.error("❌ ERROR:", error.message);
    } finally {
        await browser.close();
        console.log("\n🏁 Puppeteer Automation Test Finished.");
    }
})();
