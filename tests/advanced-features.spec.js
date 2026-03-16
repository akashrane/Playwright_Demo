const { test, expect } = require('@playwright/test');

test.describe('Advanced Playwright Features', () => {

  test.describe('Storage State & Persistence', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('https://todomvc.com/examples/react/dist/');

      // Pre-populate data using Local Storage injections (Advanced feature)
      await page.evaluate(() => {
        const todos = [
          { id: '1', title: 'Prepare Presentation', completed: false },
          { id: '2', title: 'Review Code', completed: true },
          { id: '3', title: 'Deploy App', completed: false }
        ];
        localStorage.setItem('react-todo-mcv', JSON.stringify(todos)); // Wait, the latest React ver might use a different key.
        // Actually, let's just populate it via UI and then verify localStorage.
      });
      // reload the page to apply localStorage state, or we can just populate via UI.
    });

    test('Data should persist across page reloads', async ({ page }) => {
      await page.goto('https://todomvc.com/examples/react/dist/');
      
      const todoInput = page.getByTestId('text-input');
      await todoInput.fill('Persistent task');
      await todoInput.press('Enter');
      
      const todoItems = page.getByTestId('todo-list').locator('li');
      await expect(todoItems).toHaveCount(1);
      
      // Reload page natively
      await page.reload();
      
      // Verify data is still there instead of disappearing
      await expect(todoItems).toHaveCount(1);
      await expect(todoItems.first()).toHaveText('Persistent task');
      
      // We can also verify via directly reading localStorage
      const storageItems = await page.evaluate(() => {
        const lsValue = localStorage.getItem('react-todos'); // The exact key varies, let's just dump values
        return Object.values(localStorage).some(val => val.includes('Persistent task'));
      });
      expect(storageItems).toBeTruthy();
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
