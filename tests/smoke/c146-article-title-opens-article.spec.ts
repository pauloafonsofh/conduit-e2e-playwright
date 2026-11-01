// C146 – User should be redirected to the Article page after clicking the article title in the preview
// Area: Home. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { createArticle } from '../../support/api';
import { Header } from '../../pages/header';
import { HomePage } from '../../pages/home-page';
import { ArticlePage } from '../../pages/article-page';
import { previewOpensOtherArticle, previewShowsOtherTitle } from '../../mutants/home';

smokeCase(
  'C146',
  'User should be redirected to the Article page after clicking the article title in the preview',
  { mutants: [previewOpensOtherArticle, previewShowsOtherTitle] },
  async ({ authedPage, request, user, articles }) => {
    // TODO(Paulo): steps and assertions.
    // Test data: create the article with createArticle(request, user) from support/api and call articles.track(article.slug) right away.
    // Sign in (authedPage) and click homePage.globalFeedTab: the signed-out Home is cached by the server for about 10 seconds and may not show a fresh article.
    // The preview title reads "Article title: <title>" (visible prefix); homePage.previewTitle(title) already handles it.
    // Mutants: keep at least one; each must make an assertion fail (see mutants/home.ts).
  },
);
