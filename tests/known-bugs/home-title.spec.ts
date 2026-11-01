// Known bug: after an in-app navigation to Home, the tab keeps the previous page title.
// test.fail() keeps this test green while the bug exists. If the site is fixed, the test
// turns red: close the issue and add toHaveTitle back to C131 and C132.
import { test, expect } from '@playwright/test';
import { Header } from '../../pages/header';
import { HomePage } from '../../pages/home-page';

const ISSUE = 'https://github.com/pauloafonsofh/conduit-e2e-playwright/issues/3';

for (const link of ['logo', 'homeLink'] as const) {
  test(
    `Home opened from Sign in by the ${link === 'logo' ? 'logo' : '"Home" link'} has the title "Conduit"`,
    { tag: '@known-bug', annotation: { type: 'issue', description: ISSUE } },
    async ({ page }) => {
      test.fail();
      const header = new Header(page);
      const home = new HomePage(page);
      await page.goto('/user/login');
      await header[link].click();
      await expect(page).toHaveURL(/^https?:\/\/[^/]+\/$/);
      await expect(home.banner).toBeVisible();
      await expect(page).toHaveTitle('Conduit');
    },
  );
}
