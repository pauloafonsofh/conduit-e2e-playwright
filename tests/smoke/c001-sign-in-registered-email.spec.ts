// C1 – User should be able to sign in with a registered email and a valid password
// Area: Sign In. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// Preconditions:
//   - User is registered.
//   - User is logged out.
//   - The "Sign In" page is opened.
// Steps:
//   1. Enter the registered email into the "Email or Username" field.
//   2. Enter the valid password into the "Password" field.
//   3. Click the [Sign in] button.
// Expected result:
//   - User is logged in.
//   - Username is displayed in the header.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { Header } from '../../pages/header';
import { SignInPage } from '../../pages/sign-in-page';
import { signInReturnsOtherUser, validCredentialsRejected } from '../../mutants/sign-in';

smokeCase(
  'C1',
  'User should be able to sign in with a registered email and a valid password',
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
