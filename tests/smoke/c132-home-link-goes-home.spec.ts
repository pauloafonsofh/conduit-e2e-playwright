// C132 – User should be redirected to the Home page after clicking the "Home" link in the header
// Area: Home. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { Header } from '../../pages/header';
import { HomePage } from '../../pages/home-page';
import { homeLinksBroken, homeLinkWithoutLabel } from '../../mutants/home';

smokeCase(
  'C132',
  'User should be redirected to the Home page after clicking the "Home" link in the header',
  { mutants: [homeLinksBroken, homeLinkWithoutLabel] },
  async ({ page }) => {
    const header = new Header(page);
    const home = new HomePage(page);
    await page.goto('/user/login');
    await expect(page).toHaveURL(/\/user\/login\/?$/);
    await expect(home.banner).toBeHidden();
    await expect(header.homeLink).toBeVisible();
    await expect(header.homeLink).toHaveText('Home');
    await expect(header.homeLink).toHaveAttribute('href', '/');
    await header.homeLink.click();
    await expect(page).toHaveURL(/^https?:\/\/[^/]+\/$/);
    await expect(home.banner).toBeVisible();
    await expect(home.globalFeedTab).toBeVisible();
  },
);
