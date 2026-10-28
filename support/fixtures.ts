// Shared fixtures: a fresh user per test, a page already signed in as that user,
// and an article tracker that deletes every tracked article when the test ends (pass or fail).
//
// How the front keeps the session (checked on conduit.mate.academy, 28/10/2026):
// - cookie "auth" (path /, SameSite Lax) holds the raw JWT
// - localStorage "user" holds { username, email, token, bio, image, effectiveImage }
import { test as base, expect, type Page } from '@playwright/test';
import { createUser, deleteArticle, type TestUser } from './api';

export type Fixtures = {
  user: TestUser;
  authedPage: Page;
  articles: { track(slug: string): void };
};

export const test = base.extend<Fixtures>({
  user: async ({ request }, use) => {
    await use(await createUser(request));
  },

  authedPage: async ({ page, user, baseURL }, use) => {
    const url = new URL(baseURL!);
    await page.context().addCookies([
      { name: 'auth', value: user.token, domain: url.hostname, path: '/', sameSite: 'Lax' },
    ]);
    const stored = { username: user.username, email: user.email, token: user.token, bio: null, image: null };
    // Seed once per tab, so a test that signs out stays signed out after the next navigation.
    await page.addInitScript(value => {
      if (window.sessionStorage.getItem('pqa-seeded')) return;
      window.localStorage.setItem('user', value);
      window.sessionStorage.setItem('pqa-seeded', '1');
    }, JSON.stringify(stored));
    await use(page);
  },

  articles: async ({ request, user }, use) => {
    const slugs: string[] = [];
    await use({ track: slug => slugs.push(slug) });
    for (const slug of slugs) {
      await deleteArticle(request, user, slug);
    }
  },
});

export { expect };
