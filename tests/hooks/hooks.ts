import {Before, After, Status} from '@cucumber/cucumber';
import { Browser } from '@playwright/test';
import {loadTestData} from "../../helpers/testdata_helper";
import {invokeBrowser} from "../../helpers/browser_helper";
import {PricingPage} from "../../pages/pricingPage";

let testData;
let browser:Browser;

Before(async function () {
    // Requirement 4: Resilience - Start a fresh browser for every test
    browser = await invokeBrowser()
    this.context = await browser.newContext();
    testData = loadTestData();
    this.page = await this.context.newPage();
    this.pricingPage = new PricingPage(
        this.page,
        this.attach,
        testData.pricingPage
    );
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