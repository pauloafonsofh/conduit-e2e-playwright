// Profile page at /profile/<username>. The username is an h4 and the bio a paragraph in the
// user info block (checked 01/11/2026). Data comes from /api/profiles/<username>.
import type { Locator, Page } from '@playwright/test';

export class ProfilePage {
  static readonly pathPattern = /\/profile\/[^/]+$/;

  readonly username: Locator;
  readonly bio: Locator;
  readonly image: Locator;
  readonly editSettingsLink: Locator;

  constructor(readonly page: Page) {
    const info = page.locator('.user-info');
    this.username = info.locator('h4');
    this.bio = info.locator('p');
    this.image = info.locator('img');
    this.editSettingsLink = page.getByRole('link', { name: 'Edit Profile Settings' });
  }

  async open(username: string): Promise<void> {
    await this.page.goto(`/profile/${encodeURIComponent(username)}`);
  }
}
