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
import { SignUpPage } from '../../pages/sign-up-page';
import { signInReturnsOtherUser, validCredentialsRejected } from '../../mutants/sign-in';

smokeCase(
  'C1',
  'User should be able to sign in with a registered email and a valid password',
  { mutants: [signInReturnsOtherUser, validCredentialsRejected] },
  async ({ page, user }) => {
    // TODO(Paulo): steps and assertions.
    // user: a registered user created by the API (user.email, user.password, user.username).
    // Mutants: keep at least one; each must make an assertion fail (see mutants/sign-in.ts).
  },
);
