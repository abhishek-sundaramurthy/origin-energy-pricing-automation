import { Page, Locator } from '@playwright/test';

export class ExternalPage {
    readonly page: Page;
    readonly originLogo: Locator;
    readonly referralMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        // Using a more robust selector for the logo that looks for 'Origin' in alt text
        this.originLogo = page.locator('img[alt*="Origin Energy"]');
        // Looking for the specific text that indicates the referral hand-off
        this.referralMessage = page.getByText(/you’ve been referred by Origin Energy/i);
    }

    async isOriginBrandingVisible(): Promise<boolean> {
        try {
            await this.originLogo.waitFor({ state: 'visible', timeout: 10000 });
            return await this.originLogo.isVisible();
        } catch {
            return false;
        }
    }
}