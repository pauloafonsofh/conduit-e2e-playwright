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
  async ({ authedPage, user }) => {
    // TODO(Paulo): steps and assertions.
    // Change fields that do not end the session, such as bio (and image): the JWT carries the username, so changing username or email of the fixture user is a different case.
    // After [Update Settings] the app opens /profile/<username>; ProfilePage reads the username (h4) and the bio.
    // To prove the change was saved, check the profile after a reload.
    // Mutants: keep at least one; each must make an assertion fail (see mutants/settings.ts).
  },
);
