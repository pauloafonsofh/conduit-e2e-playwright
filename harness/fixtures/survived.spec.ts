// Expected: the smoke test passes, and the mutant FAILS with "survived",
// because the injected change touches a field the test never checks.
import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { tamperJson } from '../../support/network-faults';

smokeCase(
  'H2',
  'weak test misses an unchecked field',
  {
    mutants: [
      {
        id: 'extra-field-changed',
        description: 'API changes a field the test does not assert',
        install: page => tamperJson(page, '**/api/data', body => ({ ...body, extra: 2 })),
      },
    ],
  },
  async ({ page }) => {
    await page.goto('/page');
    await expect(page.locator('#subtitle')).toHaveText('World');
  },
);
