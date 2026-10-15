import { test, expect } from 'playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

// spec: specs/saucedemo-core-user-operations.md
// seed: seed.spec.ts
test.describe('Sign out and verify session boundary @regression', () => {
  test('Sign out and verify session boundary', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');
    await inventory.addProduct('Sauce Labs Backpack');

    // 1. Open the navigation menu.
    await inventory.openMenu();
    await expect(inventory.allItemsLink).toBeVisible();
    await expect(inventory.aboutLink).toBeVisible();
    await expect(inventory.logoutLink).toBeVisible();
    await expect(inventory.resetAppStateLink).toBeVisible();

    // 2. Select logout.
    await inventory.logout();
    await expect(login.loginButton).toBeVisible();
    await expect(inventory.title).toHaveCount(0);

    // 3. Use the browser Back action.
    await page.goBack();
    await expect(login.loginButton).toBeVisible();
    await expect(inventory.title).toHaveCount(0);

    // 4. Sign in again with the standard credentials.
    await login.login('standard_user', 'secret_sauce');
    await expect(inventory.title).toBeVisible();
    const badgeCount = await inventory.cartBadge.count();
    if (badgeCount > 0) {
      const itemCount = Number(await inventory.cartBadge.innerText());
      await inventory.openCart();
      await expect(cart.cartItems).toHaveCount(itemCount);
    } else {
      await inventory.openCart();
      await expect(cart.cartItems).toHaveCount(0);
    }
  });
});
