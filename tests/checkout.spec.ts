import { test, expect } from 'playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

// spec: specs/saucedemo-core-user-operations.md
// seed: seed.spec.ts
test.describe('Complete checkout and validate required customer details @regression', () => {
  test('Complete checkout and validate required customer details', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const info = new CheckoutInfoPage(page);
    const overview = new CheckoutOverviewPage(page);
    const complete = new CheckoutCompletePage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');
    await inventory.addProduct('Sauce Labs Backpack');
    await inventory.openCart();

    // 1. Select checkout.
    await cart.checkout();
    await expect(info.continueButton).toBeVisible();

    // 2. Submit the form with all fields blank.
    await info.continue();
    await expect(info.errorMessage).toContainText(/first name is required/i);

    // 3. Fill first name and last name, leave postal code blank, and submit.
    await info.fillCustomerDetails('Taylor', 'Tester', '');
    await info.continue();
    await expect(info.errorMessage).toContainText(/postal code is required/i);

    // 4. Enter a postal code and continue.
    await info.postalCode.fill('5000');
    await info.continue();
    await expect(overview.title).toBeVisible();
    await expect(overview.itemRows).toHaveCount(1);
    await expect(overview.paymentInformation).toBeVisible();
    await expect(overview.shippingInformation).toBeVisible();
    const subtotalText = await overview.subtotal.innerText();
    const taxText = await overview.tax.innerText();
    const totalText = await overview.total.innerText();
    const amount = (value: string) => Number(value.match(/\$([\d.]+)/)?.[1]);
    expect(amount(totalText)).toBeCloseTo(amount(subtotalText) + amount(taxText), 2);

    // 5. Cancel checkout from the overview.
    await overview.cancel();
    await expect(inventory.title).toBeVisible();
    await expect(inventory.cartBadge).toHaveText('1');
    await expect(inventory.productCard('Sauce Labs Backpack').getByRole('button', { name: 'Remove' })).toBeVisible();

    // 6. Repeat checkout with valid first name, last name, and postal code; continue and select Finish.
    await inventory.openCart();
    await cart.checkout();
    await info.fillCustomerDetails('Taylor', 'Tester', '5000');
    await info.continue();
    await overview.finish();
    await expect(complete.title).toBeVisible();
    await expect(complete.confirmation).toBeVisible();
    await expect(complete.backHomeButton).toBeVisible();

    // 7. Return to inventory.
    await complete.backHome();
    await expect(inventory.title).toBeVisible();
    await expect(inventory.cartBadge).toHaveCount(0);
  });
});
