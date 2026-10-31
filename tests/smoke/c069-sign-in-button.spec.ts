// C69 – User should be able to sign in by clicking the [Sign in] button
// Area: Sign In. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { Header } from '../../pages/header';
import { SignInPage } from '../../pages/sign-in-page';
import { signInReturnsOtherUser, validCredentialsRejected } from '../../mutants/sign-in';

smokeCase(
  'C69',
  'User should be able to sign in by clicking the [Sign in] button',
  { mutants: [signInReturnsOtherUser, validCredentialsRejected] },
  async ({ page, user }) => {
    const header = new Header(page);
    const signIn = new SignInPage(page);
    await signIn.open();
    await signIn.signIn(user.email, user.password);
    await expect(page).not.toHaveURL(/\/login\/?$/);
    await expect(header.userLink(user.username)).toBeVisible();
    await expect(header.userLink(user.username)).toHaveText(user.username);
  },
);
