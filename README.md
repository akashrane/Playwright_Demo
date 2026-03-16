# Playwright Automation Showcase

A comprehensive demonstration of advanced end-to-end (E2E) testing capabilities using Playwright. This repository serves as a portfolio piece illustrating modern QA engineering practices, resilient automation strategies, and continuous integration.

Check out the fully interactive Playwright HTML Test Report generated automatically via GitHub Actions: [View Live Test Report](https://akashrane.github.io/Playwright_Demo/)

## Highlights

This project utilizes the `todomvc.com/examples/react` application as a testing ground to demonstrate the following Playwright skills:

- **Page Object Model (POM):** Clean, scalable architectural design pattern separating test logic from page locators and interaction methods (`tests/pages/TodoPage.js`).
- **Advanced Locators & Chaining:** Utilization of role-based and test-id querying (`getByRole`, `getByTestId`, `filter({ hasText: ... })`) to ensure tests are stable and resilient against DOM changes.
- **State Manipulation & Persistence:** Directly injecting and validating `localStorage` state across native page reloads (`page.evaluate`, `page.reload`).
- **Network Interception & Mocking:** Demonstrates advanced network control by completely blocking image load patterns (to mock bandwidth constraints) and stubbing hypothetical analytics API calls (`page.route`).
- **Device Emulation:** Overriding browser contexts at the test-block level to emulate an iPhone on a dark-mode theme (`test.use({ viewport, userAgent, colorScheme })`).
- **Soft Assertions:** Employing `expect.soft()` to execute compound visual validations without halting test execution prematurely.
- **Continuous Integration (CI/CD):** A fully configured GitHub Actions workflow (`.github/workflows/playwright.yml`) that executes the test suite on every push and automatically publishes the HTML test report to GitHub Pages.

## Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/akashrane/Playwright_Demo.git
cd Playwright_Demo
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Install Playwright browsers:
```bash
npx playwright install --with-deps
```

### 4. Run the test suite:
```bash
npx playwright test
```

### 5. View the test report:
```bash
npx playwright show-report
```
