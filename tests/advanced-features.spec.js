const { test, expect } = require('@playwright/test');

test.describe('Advanced Playwright Features', () => {

  test.describe('Storage State & Persistence', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('https://todomvc.com/examples/react/dist/');
      
      // We will inject a mock token into localStorage to demonstrate that Playwright
      // maintains browser state (localStorage, cookies, session) across page reloads.
      await page.evaluate(() => {
        localStorage.setItem('auth-token', 'mock-jwt-token-123');
      });
    });

    test('Local storage data should persist across page reloads', async ({ page }) => {
      // Verify data is injected
      let token = await page.evaluate(() => localStorage.getItem('auth-token'));
      expect(token).toBe('mock-jwt-token-123');
      
      // Reload page natively
      await page.reload();
      
      // Verify data is still there instead of disappearing
      token = await page.evaluate(() => localStorage.getItem('auth-token'));
      expect(token).toBe('mock-jwt-token-123');
    });
  });

  test.describe('Emulated Configurations', () => {
    // We can override settings precisely for this suite/block
    test.use({ 
      viewport: { width: 375, height: 667 }, // iPhone viewport
      hasTouch: true,
      colorScheme: 'dark',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1'
    });

    test('should render accurately on a mobile viewport', async ({ page }) => {
      await page.goto('https://todomvc.com/examples/react/dist/');
      await page.getByTestId('text-input').fill('Mobile check');
      await page.getByTestId('text-input').press('Enter');
      
      const todoItems = page.getByTestId('todo-list').locator('li');
      await expect(todoItems).toHaveCount(1);
      
      // Expect the layout to adapt
      const viewportSize = page.viewportSize();
      expect(viewportSize?.width).toBe(375);
    });
  });

  test.describe('Network Interception Demo', () => {
    test('should allow blocking specific resources or modifying network requests', async ({ page }) => {
      // Advanced routing: Block all images (TodoMVC doesn't have many, but it shows the skill)
      await page.route('**/*.{png,jpg,jpeg,svg}', route => route.abort());
      
      // Mocking a hypothetical Analytics backend call
      await page.route('**/analytics/**', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, mocked: true })
        });
      });

      await page.goto('https://todomvc.com/examples/react/dist/');
      await page.getByTestId('text-input').fill('Network test');
      await page.getByTestId('text-input').press('Enter');

      // The test passed if no pending network errors broke the flow and images were aborted silently.
      await expect(page.getByTestId('todo-list').locator('li')).toHaveCount(1);
    });
  });

  test.describe('Visual Validations and Assertions', () => {
    test('Soft assertions demo', async ({ page }) => {
      await page.goto('https://todomvc.com/examples/react/dist/');
      
      const todoInput = page.getByTestId('text-input');
      
      // Soft assertions do not stop test execution on failure
      // It will just accumulate failures.
      await expect.soft(todoInput).toBeVisible();
      await expect.soft(todoInput).toHaveAttribute('placeholder', 'What needs to be done?');
      await expect.soft(todoInput).toBeFocused();
    });
  });
});
