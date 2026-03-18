import * as fs from 'fs';
import * as path from 'path';
import {currentEnv} from "../util/config_env";

// Define an interface for your test data
interface TestData {
    pricingPage: pricingPage;
}
interface pricingPage {
    addressValue: string;
    addressSelect: string;
}

export const loadTestData = (): TestData => {

    const filePath = path.resolve(__dirname, `../testData/pricingData_${currentEnv}.json`);

    if (!fs.existsSync(filePath)) {
        throw new Error(`Test data file not found for environment: ${currentEnv}. Looked for: ${filePath}`);
    }

    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData) as TestData;
};
