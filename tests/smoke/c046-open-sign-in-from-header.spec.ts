// C46 – Not logged-in user should be able to open the "Sign In" page by clicking the "Sign in" link in the navigation bar
// Area: Sign In. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { Header } from '../../pages/header';
import { signInLinkOpensSignUp, signInLinkWithoutLabel } from '../../mutants/sign-in';

smokeCase(
  'C46',
  'Not logged-in user should be able to open the "Sign In" page by clicking the "Sign in" link in the navigation bar',
  { mutants: [signInLinkOpensSignUp, signInLinkWithoutLabel] },
  async ({ page }) => {
    const header = new Header(page);
    await page.goto('/');
    await expect(header.signInLink).toBeVisible();
    await expect(header.signInLink).toHaveText('Sign in');
    await header.signInLink.click();
    await expect(page).toHaveURL(/\/login\/?$/);
    await expect(page).toHaveTitle(/^Sign in/);
    await expect(page.getByRole('heading', { level: 1, name: 'Sign in', exact: true })).toBeVisible();
  },
);
