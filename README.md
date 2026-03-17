Origin Energy Pricing Automation Task
This repository contains a robust, BDD-driven automation suite for testing the Origin Energy pricing and referral flow. Built with Playwright, TypeScript, and Cucumber-JS, it emphasizes reliability, maintainability, and clear business logic.

🚀 Tool Selection Rationale
Playwright: Chosen for its superior "Auto-waiting" capabilities, native support for multi-tab contexts, and built-in network interception. It is significantly faster and less "flaky" than traditional Selenium-based frameworks.

TypeScript: Provides type safety and better IDE support (IntelliSense), reducing runtime errors during development.

Cucumber (BDD): Bridges the gap between technical implementation and business requirements. The Gherkin syntax allows non-technical stakeholders (Product Owners/Analysts) to validate the test scenarios.

🏗 Project Structure
Plaintext
origin-energy-pricing-automation/
├── features/
│   └── pricing_referral.feature   # Business-readable test scenarios (Gherkin)
├── pages/
│   ├── pricing.page.ts            # Page Object: Origin Pricing UI logic
│   └── external.page.ts           # Page Object: External Government site logic
├── tests/
│   ├── steps/
│   │   └── pricing_steps.ts       # Glue code linking Gherkin to POM
│   └── hooks/
│       └── hooks.ts               # Lifecycle: Browser setup, screenshots on failure
├── cucumber.js                    # BDD configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Scripts and dependencies
🛠 Setup & Execution
1. Prerequisites

Ensure you have Node.js (v18+) installed.

2. Installation

Bash
npm install
npx playwright install chromium
3. Running Tests

The suite is configured to run in headless mode by default for CI/CD compatibility.

Bash
# Run all tests
npm test

# Run tests in Headed mode (to see the browser)
npx cucumber-js --world-parameters '{"headless": false}'
🔍 Key Technical Features
Deterministic Waits: No sleep() or pause() commands are used. The suite utilizes Playwright’s waitForLoadState and state-based locator waiting.

Multi-Tab Handling: The transition from Origin to the EnergyMadeEasy government site is handled using context.waitForEvent('page'), ensuring the script captures the specific new tab created by the click action.

Resilient Selectors: Prioritizes accessible roles (getByRole, getByText) over brittle CSS classes that frequently change during UI updates.

Automated Reporting: Generates a human-readable cucumber-report.html and a JUnit-compatible JSON artifact for CI/CD pipelines.

🤖 AI Usage Disclosure
What was asked: I used an AI assistant to help architect the initial Page Object Model (POM) structure and to debug TypeScript module resolution errors (ERR_MODULE_NOT_FOUND) common in ESM/CommonJS hybrid environments.

Edits made: I manually refactored the AI's suggested "wait" logic to use specific Playwright state assertions. I also customized the "After" hooks to ensure screenshots are only attached to the report on a Status.FAILED event to save on artifact storage.

Why: AI provides a fast boilerplate, but human intervention was required to ensure the "EnergyMadeEasy" referral validation met the specific domain-checking requirements of the problem statement.

🚧 Known Limitations & Future Hardening
Geolocation: The site may prompt for "Allow Location." Current automation fills the address manually, but hardening would include mocking geolocation at the browser context level.

Cookie Banners: On fresh sessions, a cookie consent banner may appear. A global "Before" hook could be added to check for and dismiss these overlays.

Visual Regression: While we check for the Origin logo, a future enhancement would include Pixel Comparison to ensure branding is not just present, but rendered correctly.
