// Expected: the smoke test passes, and the mutant FAILS with "not caught by an assertion",
// because the injected defect only makes an action time out (no assertion ever fails).
import { smokeCase } from '../../support/smoke-case';
import { tamperDocument } from '../../support/network-faults';

smokeCase(
  'H3',
  'action times out under the mutant',
  {
    mutants: [
      {
        id: 'button-removed',
        description: 'The page is served without the Go button',
        install: page => tamperDocument(page, '**/page', html => html.replace('<button id="go">Go</button>', '')),
      },
    ],
  },
  async ({ page }) => {
    await page.goto('/page');
    await page.locator('#go').click({ timeout: 2000 });
  },
);
