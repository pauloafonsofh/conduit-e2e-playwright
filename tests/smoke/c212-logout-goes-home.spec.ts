// C212 – User should be logged out and redirected to the Home page after clicking the [Or click here to logout.] button
// Area: Settings. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { Header } from '../../pages/header';
import { SettingsPage } from '../../pages/settings-page';
import { logoutKeepsSession, logoutHeaderStale } from '../../mutants/settings';

smokeCase(
  'C212',
  'User should be logged out and redirected to the Home page after clicking the [Or click here to logout.] button',
  { mutants: [logoutKeepsSession, logoutHeaderStale] },
  async ({ authedPage: page, user }) => {
    const header = new Header(page);
    const settings = new SettingsPage(page);
    const home = /^https?:\/\/[^/]+\/?$/;

    const expectLoggedOutHeader = async () => {
      await expect(header.signInLink).toBeVisible();
      await expect(header.signUpLink).toBeVisible();
      await expect(header.userLink(user.username)).toHaveCount(0);
      await expect(header.settingsLink).toHaveCount(0);
    };

    await settings.open();
    await expect(settings.heading).toHaveText('Your Settings');
    await expect(header.userLink(user.username)).toBeVisible();
    await expect(settings.logoutButton).toBeVisible();
    await expect(settings.logoutButton).toHaveText('Or click here to logout.');
    await settings.logoutButton.click();

    await expect(page).toHaveURL(home);
    await expectLoggedOutHeader(); // before the reload

    await page.reload();
    await expect(page).toHaveURL(home);
    await expectLoggedOutHeader(); // after the reload

    await page.goto('/settings');
    await expect(page).toHaveURL(home);
  },
);
