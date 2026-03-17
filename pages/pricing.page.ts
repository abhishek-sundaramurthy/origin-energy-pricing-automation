import { Page, Locator, expect } from '@playwright/test';

export class PricingPage {
    readonly page: Page;
    readonly addressInput: Locator;
    readonly addressSuggestion: Locator;
    readonly planTable: Locator;
    readonly gasEnergyType: Locator;
    readonly electricityEnergyType: Locator;
    readonly electricityFilter: Locator;
    readonly planLink: Locator;
    readonly attach: any;

    constructor(page: Page,attach : any) {
        this.page = page;
        this.attach = attach;
        this.addressInput = page.getByRole('combobox', { name: /Your address/i });
        this.addressSuggestion = page.getByRole('option', { name: '12 Smith Street, Surry Hills NSW 2010', exact: false });
        this.planTable = page.locator('table[data-id="plan-info-table-desktop"]');
        // Using accessible roles for the filter checkbox
        this.electricityFilter = page.getByRole('checkbox', { name: /electricity/i });
        this.gasEnergyType = page.locator('td[valign]').filter({ hasText: 'Natural gas' });
        this.electricityEnergyType = page.locator('td[valign]').filter({ hasText: 'Electricity' });
        this.planLink = page.getByRole('link', { name: /view plan|compare/i }).first();

    }

    async navigate() {
        await this.page.goto('https://www.originenergy.com.au/pricing.html');
    }

    async searchAddress(address: string) {
        try{
            await this.addressInput.fill(address);
            await this.addressSuggestion.waitFor({ state: 'visible' });
            await this.addressSuggestion.click();
            await this.attach("Address is successfully entered and search action is performed")
        }
        catch(error){
            await this.attach('❌ FAILURE: Given Address is not searched successfully');
            // Take a screenshot directly from the Page Object
            const screenshot = await this.page.screenshot();
            await this.attach(screenshot, 'image/png');
            throw error;
        }


    }

    async validatePlanList() {
        try{
            await expect(this.planTable).toBeVisible();
            await this.attach("Table with List of Plans for different energy type is displayed successfully")
        }
        catch(error){
            await this.attach('❌ FAILURE: Table with List of Plans for different energy type is not displayed');
            // Take a screenshot directly from the Page Object
            const screenshot = await this.page.screenshot();
            await this.attach(screenshot, 'image/png');
            throw error;
        }

    }

    async uncheckElectricity() {
        if (await this.electricityFilter.isChecked()) {
            try{
                await this.electricityFilter.uncheck();
                await this.attach("Electricity Check Box is unchecked")
            }
            catch(error){
                await this.attach('❌ FAILURE: Something went wrong when unchecking the electricity checkbox');
                // Take a screenshot directly from the Page Object
                const screenshot = await this.page.screenshot();
                await this.attach(screenshot, 'image/png');
                throw error;
            }

        }
    }

    async checkGasEnergyType(){
        try{
            await expect(this.planTable).toBeVisible();
            //Verify that the list of gas energy type is not empty
            expect(await (this.gasEnergyType).count()).toBeGreaterThan(0);
            await this.attach("Energy Type of Natural Gas is present in the table as expected")
            //verify that the table list of electricty energy type is empty
            expect(await (this.electricityEnergyType).count()).toBe(0);
            await this.attach("Energy Type of Electricity is not present in the table as expected")
        }
        catch(error){
            await this.attach('❌ FAILURE: Energy Type of Natural Gas were not found or Energy Type of Electricity is present');
            // Take a screenshot directly from the Page Object
            const screenshot = await this.page.screenshot();
            await this.attach(screenshot, 'image/png');
            throw error;
        }

    }

    // pages/pricing.page.ts

    async clickFirstPlanLinkAndVerifyHandOff(rowIndex: 2) {
        const linkAnchor = this.page.locator('a[data-id*="energy-fact-sheet"]').first();

        try {
            this.attach('--- REFERRAL HAND-OFF START ---');
            // 2. Ensure the link is ready
            await linkAnchor.scrollIntoViewIfNeeded();
            // 2. Set up listener for a new tab (common for referral links)
            const [newPage] = await Promise.all([
                this.page.context().waitForEvent('page', { timeout: 45000 }), // Increased timeout
                linkAnchor.click({ force: true }),
            ]);

            // 3. Verify the Referral Hand-off (Checking the URL)
            await newPage.waitForLoadState('domcontentloaded');
            const url = newPage.url();

            // Example verification: check if URL contains a referral ID or 'origin'
            if (url.includes('energymadeeasy.gov.au') && url.includes('Origin')) {


                // 2. Define the Logo Locator on the NEW page
                // (Assuming the logo has an alt text or a specific class/id)
                const logo = newPage.locator('img[src*="068a3484995b2d5a09c0708a68051c14"]');


                // 3. Explicitly wait for the logo to be visible
                // This is Playwright's version of an implicit wait but much more reliable.
                await expect(logo).toBeVisible({ timeout: 20000 });
                await this.attach(`[VALIDATION] Link: Clicked | Hand-off URL: ${url} | Status: Verified ✅`);

            } else {
                throw new Error(`Unexpected Hand-off URL: ${url}`);
            }



        } catch (error) {
            await this.attach(`[VALIDATION] Link: Clicked | Status: FAILED | Error: ${error} ❌`);
            throw error;
        }
    }
}