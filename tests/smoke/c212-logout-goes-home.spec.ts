// C212 – User should be logged out and redirected to the Home page after clicking the [Or click here to logout.] button
// Area: Settings. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { Header } from '../../pages/header';
import { HomePage } from '../../pages/home-page';
import { SettingsPage } from '../../pages/settings-page';
import { logoutKeepsSession, logoutHeaderStale } from '../../mutants/settings';

smokeCase(
  'C212',
  'User should be logged out and redirected to the Home page after clicking the [Or click here to logout.] button',
  { mutants: [logoutKeepsSession, logoutHeaderStale] },
  async ({ authedPage, user }) => {
    // TODO(Paulo): steps and assertions.
    // After logout the app opens Home. A signed-out header shows "Sign in" and "Sign up" and no username link.
    // To prove the session ended, check again after a reload (authedPage signs in only once per tab).
    // Mutants: keep at least one; each must make an assertion fail (see mutants/settings.ts).
  },
);
