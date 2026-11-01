// C78 – User should be redirected to the Article page after the successful publishing
// Area: New Article. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { uniqueName } from '../../support/api';
import { EditorPage } from '../../pages/editor-page';
import { ArticlePage } from '../../pages/article-page';
import { publishAndTrack } from '../../support/publish';
import { publishRedirectsHome, articleTitleTruncated } from '../../mutants/new-article';

smokeCase(
  'C78',
  'User should be redirected to the Article page after the successful publishing',
  { mutants: [publishRedirectsHome, articleTitleTruncated] },
  async ({ authedPage, articles }) => {
    const uid = uniqueName();
    const data = { title: `Smoke C78 redirect ${uid}`, description: `Description ${uid}`, body: `Text ${uid}` };
    const editor = new EditorPage(authedPage);
    const article = new ArticlePage(authedPage);
    await editor.open();
    const slug = await publishAndTrack(authedPage, articles, data);

    await expect(authedPage).toHaveURL(slug ? new RegExp(`/article/${slug}/?$`) : /\/article\/[^/?#]+\/?$/);
    await expect(article.title).toHaveText(data.title);
    await expect(article.body).toHaveText(data.body);
  },
);
