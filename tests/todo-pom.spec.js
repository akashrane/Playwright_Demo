const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Todo MVC App - Full Coverage with POM', () => {

  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test.describe('Adding Todos', () => {
    test('should add a single item', async () => {
      await todoPage.addTodo('Buy milk');
      await expect(todoPage.todoItems).toHaveCount(1);
      await expect(todoPage.todoItems.first()).toHaveText('Buy milk');
    });

    test('should clear text input field when an item is added', async () => {
      await todoPage.addTodo('Buy coffee');
      await expect(todoPage.todoInput).toBeEmpty();
    });

    test('should append multiple items to the bottom of the list', async () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];
      await todoPage.addTodos(items);
      await expect(todoPage.todoItems).toHaveCount(3);
      await expect(todoPage.todoItems.nth(0)).toHaveText('Item 1');
      await expect(todoPage.todoItems.nth(1)).toHaveText('Item 2');
      await expect(todoPage.todoItems.nth(2)).toHaveText('Item 3');
    });

    test('empty items should not be added', async () => {
      await todoPage.addTodo('   '); // whitespace only
      await expect(todoPage.todoItems).toHaveCount(0);
    });
  });

  test.describe('Item Status Interactions', () => {
    const TODO_ITEMS = ['Learn Playwright', 'Master Automation', 'Profit'];

    test.beforeEach(async () => {
      await todoPage.addTodos(TODO_ITEMS);
    });

    test('should allow me to mark an item as completed', async () => {
      await todoPage.toggleTodo('Learn Playwright');
      const item = todoPage.todoItems.filter({ hasText: 'Learn Playwright' });
      await expect(item).toHaveClass(/completed/);
      await expect(todoPage.todoCount).toHaveText('2 items left!');
    });

    test('should allow me to un-mark an item as completed', async () => {
      await todoPage.toggleTodo('Learn Playwright');
      await todoPage.toggleTodo('Learn Playwright');
      const item = todoPage.todoItems.filter({ hasText: 'Learn Playwright' });
      await expect(item).not.toHaveClass(/completed/);
      await expect(todoPage.todoCount).toHaveText('3 items left!');
    });

    test('should allow me to mark all items as completed at once', async () => {
      await todoPage.toggleAllCheckbox.click();
      await expect(todoPage.todoItems).toHaveClass(['completed', 'completed', 'completed']);
    });
  });

  test.describe('Editing Todos', () => {
    test.beforeEach(async () => {
      await todoPage.addTodos(['Task to edit', 'Task to delete']);
    });

    test('should be able to edit an item via double-click', async () => {
      await todoPage.doubleClickTodoToEdit('Task to edit');
      const editInput = todoPage.page.locator('.todo-list input[data-testid="text-input"]');
      
      // Clear out the current text using Fill
      await editInput.fill('Edited Task');
      await editInput.press('Enter');
      
      await expect(todoPage.todoItems.first()).toHaveText('Edited Task');
    });

    test('should cancel editing on Escape', async () => {
      await todoPage.doubleClickTodoToEdit('Task to edit');
      const editInput = todoPage.page.locator('.todo-list input[data-testid="text-input"]');
      await editInput.fill('Changed accidentally');
      await editInput.press('Escape');
      
      await expect(todoPage.todoItems.first()).toHaveText('Task to edit');
    });

    test('should remove the item if an empty string was entered', async () => {
      await todoPage.doubleClickTodoToEdit('Task to edit');
      const editInput = todoPage.page.locator('.todo-list input[data-testid="text-input"]');
      await editInput.fill('');
      await editInput.press('Enter');
      
      await expect(todoPage.todoItems).toHaveCount(1);
      await expect(todoPage.todoItems).not.toContainText('Task to edit');
    });
  });

  test.describe('Filters & Footer', () => {
    const TODO_ITEMS = ['Active Item', 'Completed Item 1', 'Completed Item 2'];

    test.beforeEach(async () => {
      await todoPage.addTodos(TODO_ITEMS);
      await todoPage.toggleTodo('Completed Item 1');
      await todoPage.toggleTodo('Completed Item 2');
    });

    test('should show correct counter text', async () => {
      await expect(todoPage.todoCount).toHaveText('1 item left!');
    });

    test('should hide clear completed button when there are no completed items', async () => {
      await todoPage.toggleTodo('Completed Item 1');
      await todoPage.toggleTodo('Completed Item 2'); // All active now
      await expect(todoPage.clearCompletedButton).toBeDisabled();
    });

    test('should respect the Active filter', async () => {
      await todoPage.filterByActive();
      await expect(todoPage.todoItems).toHaveCount(1);
      await expect(todoPage.todoItems).toHaveText(['Active Item']);
    });

    test('should respect the Completed filter', async () => {
      await todoPage.filterByCompleted();
      await expect(todoPage.todoItems).toHaveCount(2);
      await expect(todoPage.todoItems).toHaveText(['Completed Item 1', 'Completed Item 2']);
    });

    test('clear completed button should remove completed items', async () => {
      await todoPage.clearCompleted();
      await expect(todoPage.todoItems).toHaveCount(1);
      await expect(todoPage.todoItems).toHaveText(['Active Item']);
    });
  });

});
