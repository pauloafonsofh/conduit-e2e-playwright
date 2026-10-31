// C71 – Logged-in user should be able to open the "New Article" page by clicking the "New Article" link in the header
// Area: New Article. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { Header } from '../../pages/header';
import { EditorPage } from '../../pages/editor-page';
import { ArticlePage } from '../../pages/article-page';
import { newArticleLinkOpensSettings, newArticleLinkWithoutLabel } from '../../mutants/new-article';

smokeCase(
  'C71',
  'Logged-in user should be able to open the "New Article" page by clicking the "New Article" link in the header',
  { mutants: [newArticleLinkOpensSettings, newArticleLinkWithoutLabel] },
  async ({ authedPage }) => {
    // TODO(Paulo): steps and assertions.
    // authedPage: a page already signed in as a fresh user (fixture user).
    // Mutants: keep at least one; each must make an assertion fail (see mutants/new-article.ts).
  },
);
