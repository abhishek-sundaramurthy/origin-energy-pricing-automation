import { Before, After, Status } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';

let browser: Browser;

Before(async function () {
    // Requirement 4: Resilience - Start a fresh browser for every test
    browser = await chromium.launch({ headless: true });
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
});

After(async function (scenario) {
    // Requirement 5: Reporting - Capture screenshot on failure
    if (scenario.result?.status === Status.FAILED) {
        const screenshot = await this.page.screenshot();
        this.attach(screenshot, 'image/png');
    }

    await this.page.close();
    await this.context.close();
    await browser.close();
});