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
  async ({ authedPage }) => {
    // TODO(Paulo): steps and assertions.
    // authedPage: a page already signed in as a fresh user (fixture user).
    // Settings page: h1 "Your Settings", tab title "Your Settings - Conduit".
    // Mutants: keep at least one; each must make an assertion fail (see mutants/settings.ts).
  },
);
