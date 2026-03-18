
// 1. Define the shape of your environment configuration
export interface EnvConfig {
    baseUrl: string;
    timeout: number;
    browser:string;
    isHeadless: string;
}

// 2. Define the settings for each environment
const config: Record<string, EnvConfig> = {
    test: {
        baseUrl: 'https://www.originenergy.com.au/pricing.html',
        timeout: 30000,
        browser: "chrome",
        isHeadless: "true",
    },
    dev: {
        baseUrl: 'https://www.originenergy.com.au/pricing.html',
        timeout: 60000,
        browser: "chrome",
        isHeadless: "true",
    },
    prod: {
        baseUrl: 'https://www.originenergy.com.au/pricing.html',
        timeout: 60000,
        browser: "chrome",
        isHeadless: "true",
    },
};

// 3. Export the specific config based on the ENV variable
// env set to test by default, if we need to change the env run the test specifying the env eg: npm run test:prod
export const currentEnv = process.env.ENV || 'test';

if (!config[currentEnv]) {
    throw new Error(`Environment "${currentEnv}" is not defined in environment.ts`);
}

export const ENV_SETTINGS = config[currentEnv];