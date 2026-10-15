import type { Locator, Page } from 'playwright/test';

export class CheckoutOverviewPage {
  readonly title: Locator;
  readonly itemRows: Locator;
  readonly itemPrices: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly paymentInformation: Locator;
  readonly shippingInformation: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByText('Checkout: Overview', { exact: true });
    this.itemRows = page.locator('.cart_item');
    this.itemPrices = page.locator('.inventory_item_price');
    this.subtotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');
    this.paymentInformation = page.getByText(/Payment Information/i);
    this.shippingInformation = page.getByText(/Shipping Information/i);
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
