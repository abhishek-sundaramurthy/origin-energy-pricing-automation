import {Page, Locator, expect} from '@playwright/test';

export class EnergyMadeEasyPage {
    readonly page: Page;
    readonly newTabLogo: Locator;
    readonly originSourceLogo: Locator;
    readonly attach: any;

    constructor(page: Page, attach: any) {
        this.page = page;
        this.attach = attach;
        this.newTabLogo = page.locator('#main img');
        this.originSourceLogo = page.getByRole('link', { name: 'Australian government -' });
    }


    async performUrlValidationsOnNewTab() {
        try{
            expect(this.page.url().toLowerCase()).toContain('origin');
            expect(this.page.url()).toContain("/www.energymadeeasy.gov.au");
            await this.attach("URL is validated for the details like gov.au and origin values to be present");
        }
        catch(error){
            await this.attach('❌ FAILURE: Something went wrong with validating the URL',"Logs");
            // Take a screenshot directly from the Page Object
            const screenshot = await this.page.screenshot();
            await this.attach(screenshot, 'image/png');
            throw error;
        }
        // Example verification: check if URL contains a referral ID or 'origin'
        
    }

    async performLogoValidationsOnNewTab(){
        try{
           await this.newTabLogo.waitFor();
           await expect(this.newTabLogo).toBeVisible();
           await this.originSourceLogo.waitFor();
           await expect(this.originSourceLogo).toBeVisible();
           await this.attach("Origin Energy logo appears on the page which confirms the origin branding.");
       }
       catch(error){
           await this.attach('❌ FAILURE: Something went wrong with validating the Logo');
           // Take a screenshot directly from the Page Object
           const screenshot = await this.page.screenshot();
           await this.attach(screenshot, 'image/png');
           throw error;
    }
    }

    async closeNewTab(): Promise<void> {
        await this.page.close();
    }


}