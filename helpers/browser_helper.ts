import { LaunchOptions, chromium, firefox, webkit } from "@playwright/test";
import {ENV_SETTINGS} from "../util/config_env";

const head : boolean = ENV_SETTINGS.isHeadless === 'false';
const options: LaunchOptions = {
    headless : head
}
export const invokeBrowser = () => {
    console.log("browser data from env file"+ ENV_SETTINGS.browser)
    const browserType = ENV_SETTINGS.browser || "chrome";
    switch (browserType) {
        case "chrome":
            return chromium.launch(options);
        case "firefox":
            return firefox.launch(options);
        case "webkit":
            return webkit.launch(options);
        default:
            throw new Error("Please set the proper browser!")
    }

}