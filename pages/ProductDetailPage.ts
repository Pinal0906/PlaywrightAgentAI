import type { Locator, Page } from 'playwright/test';

export class ProductDetailPage {
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly productImage: Locator;
  readonly addToCartButton: Locator;
  readonly backToProductsButton: Locator;

  constructor(private readonly page: Page) {
    this.productName = page.locator('.inventory_details_name');
    this.productDescription = page.locator('.inventory_details_desc');
    this.productPrice = page.locator('.inventory_details_price');
    this.productImage = page.locator('.inventory_details_img');
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.backToProductsButton = page.getByRole('button', { name: 'Back to products' });
  }

  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }
}
