// C44 – User should be able to submit the "Sign up" form by clicking the [Sign up] button
// Area: Sign Up. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { uniqueName } from '../../support/api';
import { Header } from '../../pages/header';
import { SignInPage } from '../../pages/sign-in-page';
import { SignUpPage } from '../../pages/sign-up-page';
import { signUpSavesOtherUsername, newEmailRejectedAsTaken } from '../../mutants/sign-up';

smokeCase(
  'C44',
  'User should be able to submit the "Sign up" form by clicking the [Sign up] button',
  { mutants: [signUpSavesOtherUsername, newEmailRejectedAsTaken] },
  async ({ page }) => {
    // TODO(Paulo): steps and assertions.
    // New user data: build it with uniqueName() from support/api, so parallel runs never collide.
    // Mutants: keep at least one; each must make an assertion fail (see mutants/sign-up.ts).
  },
);
