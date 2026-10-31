// C128 – User should be able to publish an article by clicking the [Publish Article] button
// Area: New Article. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { uniqueName } from '../../support/api';
import { Header } from '../../pages/header';
import { EditorPage } from '../../pages/editor-page';
import { ArticlePage } from '../../pages/article-page';
import { publishRejected, articleTitleTruncated } from '../../mutants/new-article';

smokeCase(
  'C128',
  'User should be able to publish an article by clicking the [Publish Article] button',
  { mutants: [publishRejected, articleTitleTruncated] },
  async ({ authedPage, user, articles }) => {
    // TODO(Paulo): steps and assertions.
    // Article data: build the title with uniqueName() from support/api, so parallel runs never collide. Required fields: title, description, body.
    // Cleanup: right after reaching the article page, call articles.track(new ArticlePage(authedPage).slug()), so the article is deleted even if a later assertion fails.
    // Mutants: keep at least one; each must make an assertion fail (see mutants/new-article.ts).
  },
);
