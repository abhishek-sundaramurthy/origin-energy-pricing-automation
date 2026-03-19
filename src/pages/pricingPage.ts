import { Page, Locator, expect } from '@playwright/test';

export class PricingPage {
    readonly page: Page;
    readonly addressTab:Locator;
    readonly addressInput: Locator;
    readonly addressSuggestion: Locator;
    readonly planTable: Locator;
    readonly gasEnergyType: Locator;
    readonly electricityEnergyType: Locator;
    readonly electricityFilter: Locator;
    readonly gasFilter: Locator;
    readonly planLink: Locator;
    readonly planTableUrl : Locator;
    readonly attach: any;
    readonly data : any;

    constructor(page: Page,attach : any, data:any) {
        this.page = page;
        this.attach = attach;
        this.data = data;
        this.addressTab = page.getByRole('tab', { name: 'Address' });
        this.addressInput = page.getByRole('combobox', { name: /Your address/i });
        this.addressSuggestion = page.getByRole('option', { name: data.addressSelect, exact: false });
        this.planTable = page.locator('table[data-id="plan-info-table-desktop"]');
        this.gasFilter = page.getByRole('checkbox', { name: /Natural gas/i });
        this.electricityFilter = page.getByRole('checkbox', { name: /electricity/i });
        this.gasEnergyType = page.locator('td[valign]').filter({ hasText: 'Natural gas' });
        this.electricityEnergyType = page.locator('td[valign]').filter({ hasText: 'Electricity' });
        this.planLink = page.getByRole('link', { name: /view plan|compare/i }).first();
        this.planTableUrl = page.getByRole('columnheader', { name: 'Plan BPID/EFS' });

    }

    async navigate(url:string) {
        await this.page.goto(url);
    }

    async searchAddress(address: string) {
        try{
            await this.addressTab.waitFor();
            await expect(this.addressTab).toBeVisible();
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
            await expect(this.gasFilter).toBeChecked();
            await expect(this.electricityFilter).toBeChecked();
            await this.planTable.waitFor();
            await expect(this.planTable).toBeVisible();
            await this.attach("Table with List of Plans for both Natural Gas and Electricity is displayed successfully")
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

            //verify that the table list of electricty energy type is empty
            expect(await (this.electricityEnergyType).count()).toBe(0);
            await this.attach("Energy Type of Natural Gas is present in the table as expected\n Energy Type of Electricity is not present in the table as expected")
        }
        catch(error){
            await this.attach('❌ FAILURE: Energy Type of Natural Gas were not found or Energy Type of Electricity is present');
            // Take a screenshot directly from the Page Object
            const screenshot = await this.page.screenshot();
            await this.attach(screenshot, 'image/png');
            throw error;
        }

    }

    async clickFirstGasPlanLinkAndValidateNetworkRedirect() {
        const requestPromise = this.page.waitForRequest(request =>
            request.url().includes('gov.au') && request.method() === 'GET'
        );
        const linkAnchor = this.page.locator('a[data-id*="energy-fact-sheet"]').first();

        try {
            await linkAnchor.scrollIntoViewIfNeeded();
            const [newPage] = await Promise.all([
                this.page.context().waitForEvent('page', { timeout: 45000 }), // Increased timeout
                linkAnchor.click({ force: true }),
            ]);
            const request = await requestPromise;
            console.log(`Intercepted Request to: ${request.url()}`);
            expect(request.url()).toContain('origin');
            await newPage.waitForLoadState('domcontentloaded');
            await this.attach(`First Gas Link displayed on the table is clicked successfully\n Network Redirect is checked to see whether it contains origin text value`);

            return newPage;

        } catch (error) {
            await this.attach(`[VALIDATION] Link: Clicked | Status: FAILED | Error: ${error} ❌`);
            throw error;
        }
    }

    async verifyLinkDestination() {
        const link = this.page.locator('a[data-id*="energy-fact-sheet"]').first();
        const href = await link.getAttribute('href');

        // Check if the domain is correct
        expect(href?.toLowerCase()).toContain('energymadeeasy.gov.au');
        // Check if Origin's referral ID is in the link
        expect(href?.toLowerCase()).toContain('origin');
        await this.attach("Selected Plan link have the domain values as expected");
    }

    async simulateApiError(apiurl:string,code:number,errormessage:string,message:string){
        await this.page.route(apiurl, async (route) => {
            await route.fulfill({
                status: code,
                contentType: 'application/json',
                body: JSON.stringify({ error: errormessage, message: message })
            });
        });
        await this.attach(`error code : ${code} \nerror: ${errormessage} \nmessage: ${message} `);
    }


    async checkPlanListNotAvailable() {
            await expect(this.planTable).not.toBeVisible();
            await this.attach("Table with List of Plans for both Natural Gas and Electricity is not displayed")

    }
}