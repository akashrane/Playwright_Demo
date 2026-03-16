const { expect } = require('@playwright/test');

class TodoPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.url = 'https://todomvc.com/examples/react/dist/';
    
    // Locators
    this.todoInput = page.getByTestId('text-input');
    this.todoList = page.getByTestId('todo-list');
    this.todoItems = this.todoList.locator('li');
    this.todoCount = page.getByTestId('todo-count');
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
    this.toggleAllCheckbox = page.getByTestId('toggle-all');
    
    // Filters
    this.filterAll = page.getByRole('link', { name: 'All' });
    this.filterActive = page.getByRole('link', { name: 'Active' });
    this.filterCompleted = page.getByRole('link', { name: 'Completed' });
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async addTodo(text) {
    await this.todoInput.fill(text);
    await this.todoInput.press('Enter');
  }

  async addTodos(texts) {
    for (const text of texts) {
      await this.addTodo(text);
    }
  }

  async toggleTodo(title) {
    await this.todoItems.filter({ hasText: title }).getByTestId('todo-item-toggle').check();
  }

  async uncheckTodo(title) {
    await this.todoItems.filter({ hasText: title }).getByTestId('todo-item-toggle').uncheck();
  }

  async deleteTodo(title) {
    const item = this.todoItems.filter({ hasText: title });
    await item.hover(); // Best practice: hover to make the delete button visible
    await item.getByTestId('todo-item-button').click();
  }

  async doubleClickTodoToEdit(title) {
    await this.todoItems.filter({ hasText: title }).getByTestId('todo-item-label').dblclick();
  }

  async editTodo(oldTitle, newTitle) {
    await this.doubleClickTodoToEdit(oldTitle);
    // When editing, another text input replaces the label
    const editInput = this.todoItems.filter({ hasText: oldTitle }).locator('.edit');
    await editInput.fill(newTitle);
    await editInput.press('Enter');
  }

  async checkTodoCount(count) {
    // Note: TodoMVC text ends up being "1 item left" or "2 items left"
    const expectedText = count === 1 ? '1 item left!' : `${count} items left!`;
    await expect(this.todoCount).toHaveText(expectedText);
  }

  async clearCompleted() {
    await this.clearCompletedButton.click();
  }

  async filterByActive() {
    await this.filterActive.click();
  }

  async filterByCompleted() {
    await this.filterCompleted.click();
  }

  async filterByAll() {
    await this.filterAll.click();
  }
}

module.exports = { TodoPage };
