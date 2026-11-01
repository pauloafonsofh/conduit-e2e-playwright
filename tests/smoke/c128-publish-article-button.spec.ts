// C128 – User should be able to publish an article by clicking the [Publish Article] button
// Area: New Article. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { uniqueName } from '../../support/api';
import { EditorPage } from '../../pages/editor-page';
import { ArticlePage } from '../../pages/article-page';
import { publishRejected, articleTitleTruncated } from '../../mutants/new-article';

smokeCase(
  'C128',
  'User should be able to publish an article by clicking the [Publish Article] button',
  { mutants: [publishRejected, articleTitleTruncated] },
  async ({ authedPage, articles }) => {
    const uid = uniqueName();
    const data = { title: `Smoke C128 publish ${uid}`, description: `Description ${uid}`, body: `Text ${uid}` };
    const editor = new EditorPage(authedPage);
    const article = new ArticlePage(authedPage);

    await editor.open();
    await editor.fill(data);
    await expect(editor.publishButton).toBeVisible();
    await expect(editor.publishButton).toHaveText('Publish Article');
    await expect(editor.publishButton).toBeEnabled();

    const created = authedPage
      .waitForResponse(r => r.request().method() === 'POST' && /\/api\/articles\/?$/.test(r.url()), { timeout: 15_000 })
      .catch(() => null);
    await editor.publishButton.click();
    const resp = await created;
    if (resp?.ok()) articles.track((await resp.json()).article.slug);

    await expect(authedPage).toHaveURL(/\/article\/[^/?#]+\/?$/);
    await expect(article.title).toHaveText(data.title);
    await expect(article.body).toHaveText(data.body);
  },
);
