// C210 – User should be able to update the settings by clicking the [Update Settings] button with valid values
// Area: Settings. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { uniqueName } from '../../support/api';
import { SettingsPage } from '../../pages/settings-page';
import { ProfilePage } from '../../pages/profile-page';
import { settingsNotSaved, settingsRejected } from '../../mutants/settings';

smokeCase(
  'C210',
  'User should be able to update the settings by clicking the [Update Settings] button with valid values',
  { mutants: [settingsNotSaved, settingsRejected] },
  async ({ authedPage: page, user }) => {
    const settings = new SettingsPage(page);
    const profile = new ProfilePage(page);
    const bio = uniqueName('QA bio');
    const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    await settings.open();
    await expect(settings.heading).toHaveText('Your Settings');
    await expect(settings.username).toHaveValue(user.username);
    await expect(settings.email).toHaveValue(user.email);

    const putUser = page
      .waitForResponse(
        (r) => r.request().method() === 'PUT' && /\/api\/user\/?$/.test(new URL(r.url()).pathname),
        { timeout: 10_000 },
      )
      .catch(() => null);
    await settings.update({ bio });
    const response = await putUser;
    expect(response, 'PUT /api/user was not sent').not.toBeNull();
    expect(response!.status(), await response!.text()).toBe(200);

    const profileUrl = new RegExp(`/profile/${escapeRe(user.username)}/?$`);
    await expect(page).toHaveURL(profileUrl);
    await expect(profile.username).toHaveText(user.username);
    await expect(profile.bio).toHaveText(bio);

    await page.reload();
    await expect(page).toHaveURL(profileUrl);
    await expect(profile.username).toHaveText(user.username);
    await expect(profile.bio).toHaveText(bio);
  },
);
