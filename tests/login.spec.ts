import { test, expect } from 'playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

// spec: specs/saucedemo-core-user-operations.md
// seed: seed.spec.ts
test.describe('Sign in and handle invalid credentials @regression', () => {
  test('Sign in and handle invalid credentials', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await login.goto();
    // 1. Submit the form with both username and password empty.
    await login.login('', '');
    await expect(login.errorMessage).toContainText(/username is required/i);
    await expect(login.loginButton).toBeVisible();

    // 2. Dismiss the error if a close control is available. Enter a valid username and leave the password empty; submit.
    await login.dismissErrorIfAvailable();
    await login.login('standard_user', '');
    await expect(login.errorMessage).toContainText(/password is required/i);
    await expect(login.loginButton).toBeVisible();

    // 3. Enter a non-existent username and a non-empty password; submit.
    await login.dismissErrorIfAvailable();
    await login.login('not_a_real_user', 'some_password');
    await expect(login.errorMessage).toContainText(/do not match any user/i);
    await expect(login.loginButton).toBeVisible();

    // 4. Enter standard_user and an incorrect password; submit.
    await login.dismissErrorIfAvailable();
    await login.login('standard_user', 'incorrect_password');
    await expect(login.errorMessage).toContainText(/do not match any user/i);
    await expect(login.loginButton).toBeVisible();

    // 5. Enter standard_user / secret_sauce and submit.
    await login.login('standard_user', 'secret_sauce');
    await expect(inventory.title).toBeVisible();
    await expect(inventory.productCards).toHaveCount(6);
    await expect(inventory.sortControl).toBeVisible();
    await expect(inventory.cartBadge).toHaveCount(0);
  });
});
