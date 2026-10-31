// C10 – User should be able to sign up with valid data in all fields
// Area: Sign Up. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { uniqueName } from '../../support/api';
import { Header } from '../../pages/header';
import { SignUpPage } from '../../pages/sign-up-page';
import { signUpSavesOtherUsername, newEmailRejectedAsTaken } from '../../mutants/sign-up';

smokeCase(
  'C10',
  'User should be able to sign up with valid data in all fields',
  { mutants: [signUpSavesOtherUsername, newEmailRejectedAsTaken] },
  async ({ page }) => {
    const header = new Header(page);
    const signUp = new SignUpPage(page);
    const username = uniqueName();
    const newUser = { username, email: `${username}@example.com`, password: `Pw-${uniqueName('x')}-9` };
    await signUp.open();
    await signUp.signUp(newUser);
    await expect(page).not.toHaveURL(/\/register\/?$/);
    await expect(header.userLink(newUser.username)).toBeVisible();
    await expect(header.userLink(newUser.username)).toHaveText(newUser.username);
  },
);
