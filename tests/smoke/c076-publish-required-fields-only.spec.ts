// C76 – User should be able to publish an article with valid data in the required fields only
// Area: New Article. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { uniqueName } from '../../support/api';
import { EditorPage } from '../../pages/editor-page';
import { ArticlePage } from '../../pages/article-page';
import { publishAndTrack } from '../../support/publish';
import { articleTitleTruncated, articleBodyLost } from '../../mutants/new-article';

smokeCase(
  'C76',
  'User should be able to publish an article with valid data in the required fields only',
  { mutants: [articleTitleTruncated, articleBodyLost] },
  async ({ authedPage, articles }) => {
    const uid = uniqueName();
    const data = {
      title: `Smoke C76 article ${uid}`,
      description: `Description ${uid}`,
      body: `Article body ${uid} in plain text`,
    };
    const editor = new EditorPage(authedPage);
    const article = new ArticlePage(authedPage);
    await editor.open();
    await publishAndTrack(authedPage, articles, data);

    await expect(authedPage).toHaveURL(/\/article\/[^/?#]+\/?$/);
    await expect(article.title).toHaveText(data.title);
    await expect(article.body).toHaveText(data.body);
  },
);
