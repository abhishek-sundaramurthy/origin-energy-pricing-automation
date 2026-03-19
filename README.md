# Origin Energy Pricing Automation

A BDD test automation suite (Cucumber + Playwright + TypeScript) that validates Origin Energy pricing pages and referral links to the government comparison site.

## High-level summary
- Automates user flows on the Origin pricing page: address search, plan filters, plan selection, and referral verification (external site).
- Uses page objects, Cucumber feature files, and Playwright for browser automation.
- Test environment/settings driven by ENV and JSON test data.

## Tech stack
- TypeScript
- Playwright
- Cucumber (BDD)
- Node.js / npm
- HTML/JSON reporting helpers

## Files structure & locations
- Features:
    - src/tests/features/pricing_referral.feature — Gherkin scenarios for pricing & referral flows
- Step definitions:
    - src/tests/steps/pricing_steps.ts — Maps Gherkin steps to test actions
- Hooks / lifecycle:
    - src/tests/hooks/hooks.ts — Playwright/browser setup, teardown, screenshots on failure
- Page objects:
    - src/pages/pricingPage.ts — Pricing page interactions (search, filters, select plan)
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

## Prerequisites
- Node.js (LTS) — specify required major in package.json (recommended ≥18).
- npm (bundled with Node.js).
- Playwright browsers.

Install Playwright browsers:
- Cross-platform:
    - npm install
    - npx playwright install
- On some Windows setups (native deps required):
    - npx playwright install --with-deps
- On macOS (Apple Silicon / Intel) nothing extra is usually required; use Homebrew to install Node if needed:
    - brew install node

## Installation
- Install project deps and browsers (cross-platform):
    - npm install
    - npx playwright install

## Common commands (cross-platform)
- Install deps and browsers:
    - npm install
    - npx playwright install
    - Windows native deps (if needed): npx playwright install --with-deps

- Run default tests:
    - npm test

- Run network-mock scenarios:
    - npm run test:apiNetWorkMock

- Run only e2e:
    - npm run test:e2e

- Run a specific feature file:
    - npx cucumber-js src/tests/features/pricing_referral.feature

- Run tests by tag:
    - npx cucumber-js --tags "@smoke"

- Run a single scenario (line number):
    - npx cucumber-js src/tests/features/pricing_referral.feature:10

- Headed (show browser) / headless:
    - Headed: npx cucumber-js --world-parameters '{"headless": false}'
    - Headless (default/CI): npm test

- Environment examples
    - macOS / Linux (bash/zsh):
        - export ENV=test && npm test
        - export ENV=dev && npm run test:dev
    - Windows (CMD):
        - set ENV=test && npm test
        - set ENV=dev && npm run test:dev
    - Windows (PowerShell):
        - $env:ENV="test"; npm test
        - $env:ENV="dev"; npm run test:dev

- Run with Playwright trace/screenshots enabled:
    - See hooks and browser_helper for enabling traces/screenshots; toggle via world-parameters or ENV flags implemented in the project.

## Network mocking (new)
- Purpose: simulate server errors and edge responses for the Plans Search API without changing the backend.
- How it works:
    - Test data exposes the API route matcher via `planListApiUrl` in files like [src/testData/pricingData_test.json](src/testData/pricingData_test.json).
    - The step implementation calls [`PricingPage.simulateApiError`](src/pages/pricingPage.ts) which uses Playwright's `page.route(apiurl, ...)` to fulfill the request with a synthetic response (status, body).
    - Example test tag: run the @apiNetWorkMock scenarios in [src/tests/features/pricing_referral.feature](src/tests/features/pricing_referral.feature).
- Update your test data route pattern to a stable matcher (example):
    - "planListApiUrl": "**/plans/search**" or a full pattern used by the app.
- Notes:
    - Patterns must match the network request URL. Use wildcard patterns consistent with Playwright route matching.
    - The mocked responses are injected at runtime and scoped to the scenario's page, so parallel runs can mock different behaviours in different workers.

## Parallel run guidance (updated)
- Cucumber parallelism is configured in [cucumber.js](cucumber.js) via `parallel: 2`. Each worker runs scenarios in parallel processes.
- Safety recommendations:
    - The test suite already creates a fresh browser process and context per scenario (see [src/tests/hooks/hooks.ts](src/tests/hooks/hooks.ts) and [`invokeBrowser`](src/helpers/browser_helper.ts)) which supports parallel runs.
    - Avoid shared mutable test state and on-disk artifact collisions:
        - Reports and JSON outputs may be overwritten if workers write to the same file paths. Use worker-specific output paths or merge reports post-run.
        - The CI pipeline (Jenkinsfile) uses separate pretest/cleanup steps; for local parallel runs, consider creating per-worker report folders or run sequentially when debugging.
    - If you need unique per-worker report files, run cucumber-js with worker-id-aware paths or post-process per-worker JSON to a combined report (the project already uses `src/helpers/report_helper.ts` to generate final HTML from JSON).
- Example run:
    - Parallel (Cucumber automatic config in cucumber.js): npx cucumber-js
    - Filtered by tag and parallel: npx cucumber-js --tags "@e2e"

## Artifacts & reports
- Screenshots, traces and JSON results are produced by the test hooks and the runner.
- Report generation is handled by src/helpers/report_helper.ts — check that file and package.json scripts for exact output paths (commonly artifacts/ or reports/ depending on CI configuration).
- For CI: upload the configured artifacts folder (screenshots, JSON, HTML) after the run.

## AI usages in this project
- Generated or suggested code scaffolding: page objects, initial step definitions, and feature templates.
- Test step and selector suggestions to speed up scenario creation.
- Documentation drafts and README improvements.
- Automated suggestions for flaky test mitigation and refactor ideas (not executed automatically).
- Note: AI output should be reviewed; selectors and flows must be validated against the live UI.

## Needs improvement / Future work
- Selector stability: migrate to data-test attributes to reduce flakiness.
- Retry strategy: implement controlled retries for known transient failures (network, external site).
- Parallelization: enable safe test parallel runs (isolate test data and browser contexts).
- CI integration: finalize stable pipelines (retry policies, artifact upload, environment matrix).
- Mocking/external dependencies: mock or sandbox the external referral site to eliminate third-party flakiness.
- Test coverage: add more scenarios (edge cases, negative paths, accessibility checks).
- Type safety & linting: strengthen typings and add ESLint/TS strict mode.
- Test data management: centralize and version test data, use factories for dynamic data.
- Reporting: unify reports (combine JSON, HTML, and CI-friendly artifacts).
- Secrets management: remove any hard-coded secrets and use secured store for credentials.
- Performance: measure test run times and optimize slow flows (reduce unnecessary waits).
- Documentation: expand contributor guide, troubleshooting, and local debug steps.
- CI resource usage: test parallel vs cost trade-offs; cache node_modules and playwright browsers.
- Monitoring & flakiness metrics: track flaky tests and surface root causes.

## Contributing
- Fork, branch, implement tests or fixes.
- Follow existing patterns: page objects, step definitions, and hooks.
- Add unit tests for helper modules where applicable.
- Keep changes small and add/update README where behavior changes.

## Troubleshooting
- Browser errors: ensure Playwright browsers installed (npx playwright install).
- ENV selection: set ENV environment variable before running tests.
- Failures: check screenshots in the artifacts folder and Playwright traces if enabled.

## Contact / Next steps
- For a guided walkthrough, point to a file or scenario and I can trace exact flow and assertions.
- To apply these README changes directly, run the update or confirm and I will provide the updated file content.
 