# Origin Energy Pricing Automation

A BDD test automation suite (Cucumber + Playwright + TypeScript) that validates Origin Energy pricing pages and referral links to the government comparison site.

## High-level summary
- Automates user flows on the Origin pricing page: address search, plan filters, plan selection, and referral verification (external site).
- Uses page objects, Cucumber feature files, and Playwright for browser automation.
- Test environment driven by ENV JSON test data.

## Folder structure & locations
- Features:
  - src/tests/features/pricing_referral.feature — Gherkin scenarios for pricing,referral and network mocking flows
- Step definitions:
  - src/tests/steps/pricing_steps.ts — Maps Gherkin steps to test actions
- Hooks / lifecycle:
  - src/tests/hooks/hooks.ts — Playwright/browser setup, teardown, screenshots on failure
- Page objects:
  - src/pages/pricingPage.ts — Pricing page interactions (search, checkbox, select plan)
  - src/pages/energyMadeEasyPage.ts — External referral page verifications
- Helpers:
  - src/helpers/browser_helper.ts — Browser launch / Playwright options (invokeBrowser)
  - src/helpers/testdata_helper.ts — Load environment-specific test data (loadTestData)
  - src/helpers/report_helper.ts — Convert/format JSON test results and generate HTML
- Config & env:
  - src/util/config_env.ts — ENV_SETTINGS and currentEnv loader
  - cucumber.js — Cucumber runner config
  - tsconfig.json — TypeScript configuration
- Test data:
  - src/testData/pricingData_test.json — Default test payloads for "test" env (environment-specific files may exist)
- Project metadata & scripts:
  - package.json — npm scripts, dependencies (e.g., cucumber, playwright)
- CI:
  - Jenkinsfile — example pipeline configuration for CI runs

## Features

1. Reports with screenshot on failure and capturing logs
2. Execute tests on multiple environments
3. Parallel execution
4. Rerun only failed features
5. Retry failed tests on CI
6. Page object model
7. Jenkins file for CI

## Sample report

Reports generated and present inside the reports folder
1. default cucumber report
2. JSON report for CI
3. rerun text

### Setup:

1. Clone or download the project
2. Extract and open in IntelliJ
- Install dep and browsers:
  `npm install` to install the dependencies
  `npx playwright install` to install the browsers

- Run default tests:
  `npm test`

- Run network-mock scenarios:
  `npm run test:apiNetWorkMock`

- Run only e2e:
  `npm run test:e2e`

- Run by env:
  `npm run test:dev`
  `npm run test:test`
  `npm run test:prod`

## Tool Rationale Details to Include

1. Playwright :
   Reason to use : Open Source, Modern, fast automation engine that provides native browser isolation and robust network interception.
   Key Benefits: ability to support multiple browsers (Chromium, Firefox, WebKit) with a single API, fast and reliable execution, auto-wait mechanisms (reducing flaky tests),network interception and support for modern web features.


2. Cucumber :
   Reason to use : Allows non-technical stakeholders (Product Owners/BAs) to read and approve test scenarios.
   Key Benefits: Creates Living Documentation that allows stakeholders to verify test coverage while supporting reusable, parameterized test data.Enables targeted runs (e.g., @apiNetWorkMock vs. @smoke) to optimize CI/CD pipeline speed.


3. Page Object Model (POM) Rationale:
   Reason to use: Decouples the test scripts from the UI elements by centralizing locators and actions within page-specific classes.
   Key Benefits: Enhances maintainability by allowing UI changes (like a button ID or CSS class) to be updated in a single file rather than across dozens of test cases.

4. TypeScript: Adds a strong type system on top of JavaScript to catch errors during development rather than at runtime.
5. Reporting (built-in HTML reporter): Selected to provide detailed test reports including custom log message,screenshots for failed tests, which is crucial for debugging and maintenance.
6. CI/CD Integration: Mention how the framework is designed to integrate easily into the CI/CD pipeline (e.g., Jenkins, GitLab CI) for automated execution on every build.

## Execution Strategy
- Parallelization: Running tests in parallel (configured in cucumber.js) to reduce total execution time from minutes to seconds.
- Retry Mechanism: Automatically re-running flaky UI tests to ensure build stability in the Jenkins pipeline.
- Environment Switching: Using cross-env to switch between test, dev, and prod endpoints without code changes.

## AI usages in this project
- Generated or suggested code scaffolding: page objects, initial step definitions, and feature templates.
- Documentation drafts and README improvements.

##  Future work
- Migrate to Playwright Test Runner.
- Containerized Mocking with Docker.
