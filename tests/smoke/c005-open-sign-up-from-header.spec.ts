// C5 – Not logged-in user should be able to open the "Sign Up" page by clicking the "Sign up" link in the header
// Area: Sign Up. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { Header } from '../../pages/header';
import { signUpLinkOpensSignIn, signUpLinkWithoutLabel } from '../../mutants/sign-up';

smokeCase(
  'C5',
  'Not logged-in user should be able to open the "Sign Up" page by clicking the "Sign up" link in the header',
  { mutants: [signUpLinkOpensSignIn, signUpLinkWithoutLabel] },
  async ({ page }) => {
    const header = new Header(page);
    await page.goto('/');
    await expect(header.signUpLink).toBeVisible();
    await expect(header.signUpLink).toHaveText('Sign up');
    await header.signUpLink.click();
    await expect(page).toHaveURL(/\/register\/?$/);
    await expect(page).toHaveTitle(/^Sign up/);
    await expect(page.getByRole('heading', { level: 1, name: 'Sign up', exact: true })).toBeVisible();
  },
);
