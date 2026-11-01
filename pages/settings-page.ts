// "Your Settings" page at /settings (tab title "Your Settings - Conduit", checked 01/11/2026).
// [Update Settings] sends PUT /api/user and then opens /profile/<username>.
// [Or click here to logout.] clears the session and opens Home.
import type { Locator, Page } from '@playwright/test';

export type SettingsInput = { image?: string; username?: string; bio?: string; email?: string; password?: string };

export class SettingsPage {
  static readonly path = '/settings';

  readonly heading: Locator;
  readonly image: Locator;
  readonly username: Locator;
  readonly bio: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly updateButton: Locator;
  readonly logoutButton: Locator;
  readonly errors: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.image = page.getByRole('textbox', { name: 'URL of profile picture' });
    this.username = page.getByRole('textbox', { name: 'Username' });
    this.bio = page.getByRole('textbox', { name: 'Short bio about you' });
    this.email = page.getByRole('textbox', { name: 'Email' });
    this.password = page.getByRole('textbox', { name: 'New Password' });
    this.updateButton = page.getByRole('button', { name: 'Update Settings', exact: true });
    this.logoutButton = page.getByRole('button', { name: 'Or click here to logout.', exact: true });
    this.errors = page.locator('.error-messages');
  }

  async open(): Promise<void> {
    await this.page.goto(SettingsPage.path);
  }

  /** Fill only the fields given. */
  async fill(data: SettingsInput): Promise<void> {
    if (data.image !== undefined) await this.image.fill(data.image);
    if (data.username !== undefined) await this.username.fill(data.username);
    if (data.bio !== undefined) await this.bio.fill(data.bio);
    if (data.email !== undefined) await this.email.fill(data.email);
    if (data.password !== undefined) await this.password.fill(data.password);
  }

  async update(data: SettingsInput): Promise<void> {
    await this.fill(data);
    await this.updateButton.click();
  }
}
