// C153 – Logged-in user should be able to like an article by clicking the "Like" button
// Area: Home. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { createArticle } from '../../support/api';
import { Header } from '../../pages/header';
import { HomePage } from '../../pages/home-page';
import { likeNotSaved, likeRejected } from '../../mutants/home';

smokeCase(
  'C153',
  'Logged-in user should be able to like an article by clicking the "Like" button',
  { mutants: [likeNotSaved, likeRejected] },
  async ({ authedPage, request, user, articles }) => {
    // TODO(Paulo): steps and assertions.
    // Test data: create the article with createArticle(request, user) from support/api and call articles.track(article.slug) right away.
    // Sign in (authedPage) and click homePage.globalFeedTab: the signed-out Home is cached by the server for about 10 seconds and may not show a fresh article.
    // The like button updates the counter before the API answers (optimistic). To prove the like was saved, reload and check again.
    // Mutants: keep at least one; each must make an assertion fail (see mutants/home.ts).
  },
);
