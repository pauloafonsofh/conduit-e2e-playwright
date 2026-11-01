// C164 – Logged-in user should be able to open the Settings page by clicking the "Settings" link in the header
// Area: Settings. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { Header } from '../../pages/header';
import { SettingsPage } from '../../pages/settings-page';
import { settingsLinkOpensNewArticle, settingsLinkWithoutLabel } from '../../mutants/settings';

smokeCase(
  'C164',
  'Logged-in user should be able to open the Settings page by clicking the "Settings" link in the header',
  { mutants: [settingsLinkOpensNewArticle, settingsLinkWithoutLabel] },
  async ({ authedPage: page, user }) => {
    const header = new Header(page);
    const settings = new SettingsPage(page);

    await page.goto('/');
    await expect(header.userLink(user.username)).toBeVisible();
    await expect(header.settingsLink).toBeVisible();
    await expect(header.settingsLink).toHaveText('Settings');
    await header.settingsLink.click();

    await expect(page).toHaveURL(/\/settings\/?$/);
    await expect(page).toHaveTitle('Your Settings - Conduit');
    await expect(page.getByRole('heading', { level: 1, name: 'Your Settings', exact: true })).toBeVisible();
    await expect(settings.updateButton).toBeVisible();
  },
);
