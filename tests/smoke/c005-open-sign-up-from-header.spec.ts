// C5 – Not logged-in user should be able to open the "Sign Up" page by clicking the "Sign up" link in the header
// Area: Sign Up. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { Header } from '../../pages/header';
import { SignInPage } from '../../pages/sign-in-page';
import { SignUpPage } from '../../pages/sign-up-page';
import { signUpLinkOpensSignIn, signUpLinkWithoutLabel } from '../../mutants/sign-up';

smokeCase(
  'C5',
  'Not logged-in user should be able to open the "Sign Up" page by clicking the "Sign up" link in the header',
  { mutants: [signUpLinkOpensSignIn, signUpLinkWithoutLabel] },
  async ({ page }) => {
    // TODO(Paulo): steps and assertions.
    // Mutants: keep at least one; each must make an assertion fail (see mutants/sign-up.ts).
  },
);
