// Expected: the smoke test passes, and both mutants are caught by the title/subtitle assertions.
import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { tamperDocument, tamperJson } from '../../support/network-faults';

smokeCase(
  'H1',
  'page shows title and subtitle',
  {
    mutants: [
      {
        id: 'subtitle-changed-in-api',
        description: 'API returns a different subtitle',
        install: page => tamperJson(page, '**/api/data', body => ({ ...body, subtitle: 'Earth' })),
      },
      {
        id: 'title-changed-in-next-data',
        description: 'Server-rendered data carries a different title',
        install: page => tamperDocument(page, '**/page', html => html.replace('"title":"Hello"', '"title":"Bye"')),
      },
    ],
  },
  async ({ page }) => {
    await page.goto('/page');
    await expect(page.locator('#title')).toHaveText('Hello');
    await expect(page.locator('#subtitle')).toHaveText('World');
  },
);
