// C69 – User should be able to sign in by clicking the [Sign in] button
// Area: Sign In. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { Header } from '../../pages/header';
import { SignInPage } from '../../pages/sign-in-page';
import { SignUpPage } from '../../pages/sign-up-page';
import { signInReturnsOtherUser, validCredentialsRejected } from '../../mutants/sign-in';

smokeCase(
  'C69',
  'User should be able to sign in by clicking the [Sign in] button',
  { mutants: [signInReturnsOtherUser, validCredentialsRejected] },
  async ({ page, user }) => {
    // TODO(Paulo): steps and assertions.
    // user: a registered user created by the API (user.email, user.password, user.username).
    // Mutants: keep at least one; each must make an assertion fail (see mutants/sign-in.ts).
  },
);
