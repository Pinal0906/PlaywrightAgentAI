import { test, expect } from 'playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

// spec: specs/saucedemo-core-user-operations.md
// seed: seed.spec.ts
test.describe('Add, review, and remove cart items @regression', () => {
  test('Add, review, and remove cart items', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');

    // 1. Add two different products from inventory.
    await inventory.addProduct('Sauce Labs Backpack');
    await inventory.addProduct('Sauce Labs Bike Light');
    await expect(inventory.productCard('Sauce Labs Backpack').getByRole('button', { name: 'Remove' })).toBeVisible();
    await expect(inventory.productCard('Sauce Labs Bike Light').getByRole('button', { name: 'Remove' })).toBeVisible();
    await expect(inventory.cartBadge).toHaveText('2');

    // 2. Open the cart using the cart icon.
    await inventory.openCart();
    await expect(cart.itemNames).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
    await expect(cart.itemPrices).toHaveCount(2);
    await expect(cart.quantities).toHaveText(['1', '1']);
    await expect(inventory.cartBadge).toHaveText('2');

    // 3. Remove one item from the cart.
    await cart.removeProduct('Sauce Labs Backpack');
    await expect(cart.itemNames).toHaveText(['Sauce Labs Bike Light']);
    await expect(inventory.cartBadge).toHaveText('1');

    // 4. Continue shopping and return to inventory.
    await cart.continueShopping();
    await expect(inventory.title).toBeVisible();
    await expect(inventory.productCard('Sauce Labs Bike Light').getByRole('button', { name: 'Remove' })).toBeVisible();
    await expect(inventory.cartBadge).toHaveText('1');

    // 5. Remove the remaining item from inventory, then reopen the cart.
    await inventory.removeProduct('Sauce Labs Bike Light');
    await expect(inventory.cartBadge).toHaveCount(0);
    await inventory.openCart();
    await expect(cart.cartItems).toHaveCount(0);
    await expect(cart.title).toBeVisible();
  });
});
