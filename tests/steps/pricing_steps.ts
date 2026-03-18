import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PricingPage } from '../../pages/pricingPage';
import { ExternalPage } from '../../pages/external.page';

// Note: In a real setup, 'page' and 'context' are provided by a World Constructor or Hooks
Given('I navigate to the Origin Energy pricing page', async function () {
    this.pricingPage = new PricingPage(this.page,this.attach);
    await this.pricingPage.navigate();
});

When('I search for the address {string}', async function (address: string) {
    await this.pricingPage.searchAddress(address);
});

When('I validate whether plan list is displayed', async function () {
    await this.pricingPage.validatePlanList();
    console.log("Plan List is present")
});

When('I uncheck the {string} filter', async function (service: string) {
    // Logic can be made dynamic based on 'service' string
    await this.pricingPage.uncheckElectricity();
});

When('I should see that Gas plans are still displayed', async function () {
    await this.pricingPage.checkGasEnergyType();
});

Then('I click on a plan link to view details', async function () {
    // Start listening for the popup/new tab
    await this.pricingPage.clickFirstPlanLinkAndVerifyHandOff();
});

Then('a new tab should open for {string}', async function (siteName: string) {
    await this.externalTab.waitForLoadState();
    expect(this.externalTab.url()).toContain('energymadeeasy.gov.au');
});

Then('the page should display Origin Energy branding', async function () {
    const externalPage = new ExternalPage(this.externalTab);
    const isBranded = await externalPage.isOriginBrandingVisible();
    expect(isBranded).toBe(true);
});

Then('the URL should contain {string} as a referral parameter', async function (param: string) {
    expect(this.externalTab.url()).toContain(param);
});