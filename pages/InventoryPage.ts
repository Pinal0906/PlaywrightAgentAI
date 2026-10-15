import type { Locator, Page } from 'playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly productCards: Locator;
  readonly sortControl: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByText('Products', { exact: true });
    this.productCards = page.locator('.inventory_item');
    this.sortControl = page.getByRole('combobox');
    this.cartLink = page.getByRole('button', { name: /^Cart(?:,|$)/i });
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByRole('button', { name: 'Logout' });
    this.allItemsLink = page.getByRole('button', { name: 'All Items' });
    this.aboutLink = page.getByRole('link', { name: 'About' });
    this.resetAppStateLink = page.getByRole('button', { name: 'Reset App State' });
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
  }

  productCard(productName: string): Locator {
    return this.productCards.filter({ has: this.page.getByText(productName, { exact: true }) });
  }

  async addProduct(productName: string): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeProduct(productName: string): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async openProduct(productName: string): Promise<void> {
    await this.productCard(productName)
      .getByRole('button', { name: `View details for ${productName}` }).first().click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async sortBy(option: string): Promise<void> {
    await this.sortControl.selectOption({ label: option });
  }

  async openMenu(): Promise<void> {
    await this.menuButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }
}
