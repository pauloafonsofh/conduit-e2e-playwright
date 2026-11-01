// Top navigation bar. Signed-out users see Home, Sign in and Sign up;
// signed-in users see Home, New Article, Settings and a link with their username.
import type { Locator, Page } from '@playwright/test';

export class Header {
  readonly nav: Locator;
  readonly logo: Locator;
  readonly homeLink: Locator;
  readonly signInLink: Locator;
  readonly signUpLink: Locator;
  readonly newArticleLink: Locator;
  readonly settingsLink: Locator;

  constructor(readonly page: Page) {
    this.nav = page.getByRole('navigation');
    this.logo = this.nav.getByRole('link', { name: 'conduit', exact: true });
    this.homeLink = this.nav.getByRole('link', { name: 'Home', exact: true });
    this.signInLink = this.nav.getByRole('link', { name: 'Sign in' });
    this.signUpLink = this.nav.getByRole('link', { name: 'Sign up' });
    this.newArticleLink = this.nav.getByRole('link', { name: 'New Article' });
    this.settingsLink = this.nav.getByRole('link', { name: 'Settings' });
  }

  /** The link to the signed-in user's profile, labelled with the username. */
  userLink(username: string): Locator {
    return this.nav.getByRole('link', { name: username });
  }
}
