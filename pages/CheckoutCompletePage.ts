import type { Locator, Page } from 'playwright/test';

export class CheckoutCompletePage {
  readonly title: Locator;
  readonly confirmation: Locator;
  readonly backHomeButton: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByText('Checkout: Complete!', { exact: true });
    this.confirmation = page.getByText('Thank you for your order!', { exact: true });
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
