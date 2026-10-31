// "Sign up" page at /user/register.
import type { Locator, Page } from '@playwright/test';

export class SignUpPage {
  static readonly path = '/user/register';

  readonly heading: Locator;
  readonly username: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly signUpButton: Locator;
  readonly errors: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.username = page.getByRole('textbox', { name: 'Username' });
    this.email = page.getByRole('textbox', { name: 'Email' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.signUpButton = page.getByRole('button', { name: 'Sign up' });
    this.errors = page.locator('.error-messages');
  }

  async open(): Promise<void> {
    await this.page.goto(SignUpPage.path);
  }

  async signUp(data: { username: string; email: string; password: string }): Promise<void> {
    await this.username.fill(data.username);
    await this.email.fill(data.email);
    await this.password.fill(data.password);
    await this.signUpButton.click();
  }
}
