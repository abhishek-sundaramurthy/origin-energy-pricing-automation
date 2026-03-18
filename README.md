Origin Energy Pricing Automation Task
This repository contains a robust, BDD-driven automation suite for testing the Origin Energy pricing and referral flow. Built with Playwright, TypeScript, and Cucumber-JS, it emphasizes reliability, maintainability, and clear business logic.

🚀 Tool Selection Rationale
Playwright: Chosen for its superior "Auto-waiting" capabilities, native support for multi-tab contexts.

TypeScript: Provides type safety and better IDE support, reducing runtime errors.

Cucumber (BDD): Bridges the gap between technical implementation and business requirements. The Gherkin syntax allows to validate the test scenarios.

🏗 Project Structure
Plaintext
origin-energy-pricing-automation/
├── features/
│   └── pricing_referral.feature   # Business-readable test scenarios (Gherkin)
├── pages/
│   ├── pricingPage.ts            # Page Object: Origin Pricing UI logic
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
npx playwright install --with-deps

3. Running Tests

The suite is configured to run in headless mode by default for CI/CD compatibility.

Bash
# Run all tests
npm test

# Run tests in Headed mode (to see the browser)
npx cucumber-js --world-parameters '{"headless": false}'
