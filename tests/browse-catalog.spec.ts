import { test, expect } from 'playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';

// spec: specs/saucedemo-core-user-operations.md
// seed: seed.spec.ts
test.describe('Browse the catalog and sort products @regression', () => {
  test('Browse the catalog and sort products', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const detail = new ProductDetailPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');

    // 1. Review the inventory page. Confirm each product card presents a name, description, price, image, and add-to-cart control.
    await expect(inventory.productCards).toHaveCount(6);
    for (const card of await inventory.productCards.all()) {
      await expect(card.locator('.inventory_item_name')).toBeVisible();
      await expect(card.locator('.inventory_item_desc')).toBeVisible();
      await expect(card.locator('.inventory_item_price')).toBeVisible();
      await expect(card.getByRole('img')).toBeVisible();
      await expect(card.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    }

    // 2. Open a product by selecting its name or image.
    await inventory.openProduct('Sauce Labs Backpack');
    await expect(detail.productName).toHaveText('Sauce Labs Backpack');
    await expect(detail.productDescription).toBeVisible();
    await expect(detail.productPrice).toBeVisible();
    await expect(detail.productImage).toBeVisible();
    await expect(detail.addToCartButton).toBeVisible();

    // 3. Return to the inventory list using the page's back-to-products control.
    await detail.backToProducts();
    await expect(inventory.title).toBeVisible();
    await expect(inventory.productCard('Sauce Labs Backpack')
      .getByRole('button', { name: 'Add to cart' })).toBeVisible();
    await expect(inventory.cartBadge).toHaveCount(0);

    // 4. Change the sort control to price low-to-high. Compare visible prices in sequence.
    await inventory.sortBy('Price (low to high)');
    const lowToHigh = await inventory.productPrices.allTextContents();
    const prices = lowToHigh.map((price) => Number(price.replace('$', '')));
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    await expect(inventory.productCards).toHaveCount(6);

    // 5. Change the sort control to name Z-to-A. Compare product names in sequence.
    await inventory.sortBy('Name (Z to A)');
    const zToA = await inventory.productNames.allTextContents();
    expect(zToA).toEqual([...zToA].sort((a, b) => b.localeCompare(a)));
    await expect(inventory.cartBadge).toHaveCount(0);

    // 6. Select the default name A-to-Z sort.
    await inventory.sortBy('Name (A to Z)');
    const aToZ = await inventory.productNames.allTextContents();
    expect(aToZ).toEqual([...aToZ].sort((a, b) => a.localeCompare(b)));
  });
});
