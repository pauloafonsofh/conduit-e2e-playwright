// "Sign in" page at /user/login. The site labels the first field "Email"
// (TestRail C1 calls it "Email or Username").
import type { Locator, Page } from '@playwright/test';

export class SignInPage {
  static readonly path = '/user/login';

  readonly heading: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly signInButton: Locator;
  readonly errors: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.email = page.getByRole('textbox', { name: 'Email' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.errors = page.locator('.error-messages');
  }

  async open(): Promise<void> {
    await this.page.goto(SignInPage.path);
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.signInButton.click();
  }
}
