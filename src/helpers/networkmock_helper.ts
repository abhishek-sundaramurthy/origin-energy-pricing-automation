import { Page } from "@playwright/test";

export class NetworkMock {
    readonly page: Page;
    readonly attach: any

    constructor(page: Page, attach: any) {
        this.page = page;
        this.attach = attach;
    }


    async simulateApiError(apiurl: string, code: number, errormessage: string, message: string) {
        await this.page.route(apiurl, async (route) => {
            await route.fulfill({
                status: code,
                contentType: 'application/json',
                body: JSON.stringify({error: errormessage, message: message})
            });
        });
        await this.attach(`error code : ${code} \nerror: ${errormessage} \nmessage: ${message} `);
    }

}