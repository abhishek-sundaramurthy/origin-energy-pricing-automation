import { Given, When, Then,setDefaultTimeout } from '@cucumber/cucumber';
import { EnergyMadeEasyPage} from "../../pages/energyMadeEasyPage";
import {ENV_SETTINGS} from "../../util/config_env";
import {loadTestData} from "../../helpers/testdata_helper";

setDefaultTimeout(60 * 1000 * 2)

Given('user navigates to the Origin Energy pricing page', async function () {
    await this.pricingPage.navigate(ENV_SETTINGS.baseUrl);
});

When('user enters the address and selects the address from the dropdown', async function () {
    await this.pricingPage.searchAddress(loadTestData().pricingPage.addressValue);
});

When('user validates whether the plan list is displayed with both Electricity and Natural Gas checked', async function () {
    await this.pricingPage.validatePlanList();
    console.log("Plan List is present")
});

When('user unchecks the Electricity checkbox', async function () {
    await this.pricingPage.uncheckElectricity();
});

When('user should see that only Gas plans are still displayed', async function () {
    await this.pricingPage.checkGasEnergyType();
});

Then('user clicks on the first gas plan link displayed on the plan detail table', async function () {
    this.newTab = await this.pricingPage.clickFirstGasPlanLinkAndValidateNetworkRedirect();
});

Then('a new tab should be opened for EnergyMadeEasy', async function () {
    if (!this.newTab) {
        throw new Error("No new tab was detected from the previous step!");
    }
    else{
        this.attach("New Tab for Energy Made Easy is opened");
    }

});

Then('then user validates the url for referral', async function () {
    const energyMadeEasyPage = new EnergyMadeEasyPage(this.newTab, this.attach);
    await energyMadeEasyPage.performUrlValidationsOnNewTab()
});

Then('user validates whether the clicked gas plan link contains the expected domain', async function () {
    await this.pricingPage.verifyLinkDestination()
});

Then('then user validates the origin logo in the new page', async function () {
    const energyMadeEasyPage = new EnergyMadeEasyPage(this.newTab, this.attach);
    await energyMadeEasyPage.performLogoValidationsOnNewTab()
    await energyMadeEasyPage.closeNewTab()
});

When('the server returns a error for the plan list request', async function () {
    await this.pricingPage.simulateApiError(loadTestData().pricingPage.planListApiUrl);
});

Then('user should not be able to see any plan List', async function () {
    await this.pricingPage.checkPlanListNotAvailable();
});