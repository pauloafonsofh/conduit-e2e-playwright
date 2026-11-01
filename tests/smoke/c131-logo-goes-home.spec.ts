// C131 – User should be redirected to the Home page after clicking the "conduit" logo in the upper left corner
// Area: Home. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { Header } from '../../pages/header';
import { HomePage } from '../../pages/home-page';
import { homeLinksBroken, logoWithoutLabel } from '../../mutants/home';

smokeCase(
  'C131',
  'User should be redirected to the Home page after clicking the "conduit" logo in the upper left corner',
  { mutants: [homeLinksBroken, logoWithoutLabel] },
  async ({ page }) => {
    const header = new Header(page);
    const home = new HomePage(page);
    await page.goto('/user/login');
    await expect(page).toHaveURL(/\/user\/login\/?$/);
    await expect(home.banner).toBeHidden();
    await expect(header.logo).toBeVisible();
    await expect(header.logo).toHaveText('conduit');
    await expect(header.logo).toHaveAttribute('href', '/');
    await header.logo.click();
    await expect(page).toHaveURL(/^https?:\/\/[^/]+\/$/);
    await expect(home.banner).toBeVisible();
    await expect(home.globalFeedTab).toBeVisible();
  },
);
