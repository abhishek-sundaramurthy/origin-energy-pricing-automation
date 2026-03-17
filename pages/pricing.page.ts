import { Page, Locator, expect } from '@playwright/test';

export class PricingPage {
    readonly page: Page;
    readonly addressInput: Locator;
    readonly addressSuggestion: Locator;
    readonly electricityFilter: Locator;
    readonly gasLabel: Locator;
    readonly planLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addressInput = page.getByRole('textbox', { name: /enter address/i });
        this.addressSuggestion = page.getByText('12 Smith Street, Surry Hills NSW 2010');
        // Using accessible roles for the filter checkbox
        this.electricityFilter = page.getByRole('checkbox', { name: /electricity/i });
        this.gasLabel = page.getByText(/gas plans/i);
        this.planLink = page.getByRole('link', { name: /view plan|compare/i }).first();
    }

    async navigate() {
        await this.page.goto('https://www.originenergy.com.au/pricing.html');
    }

    async searchAddress(address: string) {
        await this.addressInput.fill(address);
        await this.addressSuggestion.waitFor({ state: 'visible' });
        await this.addressSuggestion.click();
    }

    async uncheckElectricity() {
        if (await this.electricityFilter.isChecked()) {
            await this.electricityFilter.uncheck();
        }
    }
}