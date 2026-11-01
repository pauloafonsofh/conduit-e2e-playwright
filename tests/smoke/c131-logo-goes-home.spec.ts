// C131 – User should be redirected to the Home page after clicking the "conduit" logo in the upper left corner
// Area: Home. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { Header } from '../../pages/header';
import { HomePage } from '../../pages/home-page';
import { homeLinksBroken, logoWithoutLabel } from '../../mutants/home';

smokeCase(
  'C131',
  'User should be redirected to the Home page after clicking the "conduit" logo in the upper left corner',
  { mutants: [homeLinksBroken, logoWithoutLabel] },
  async ({ page }) => {
    // TODO(Paulo): steps and assertions.
    // Start on a page other than Home (for example /user/login); starting on Home would prove nothing.
    // Mutants: keep at least one; each must make an assertion fail (see mutants/home.ts).
  },
);
