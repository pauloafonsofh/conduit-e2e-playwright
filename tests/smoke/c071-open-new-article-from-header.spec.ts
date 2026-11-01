// C71 – Logged-in user should be able to open the "New Article" page by clicking the "New Article" link in the header
// Area: New Article. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { Header } from '../../pages/header';
import { EditorPage } from '../../pages/editor-page';
import { newArticleLinkOpensSettings, newArticleLinkWithoutLabel } from '../../mutants/new-article';

smokeCase(
  'C71',
  'Logged-in user should be able to open the "New Article" page by clicking the "New Article" link in the header',
  { mutants: [newArticleLinkOpensSettings, newArticleLinkWithoutLabel] },
  async ({ authedPage }) => {
    const header = new Header(authedPage);
    const editor = new EditorPage(authedPage);
    await authedPage.goto('/');
    await expect(header.newArticleLink).toBeVisible();
    await expect(header.newArticleLink).toHaveText('New Article');
    await header.newArticleLink.click();
    await expect(authedPage).toHaveURL(/\/editor\/?$/);
    await expect(authedPage).toHaveTitle(/^New article/);
    await expect(editor.title).toBeVisible();
    await expect(editor.body).toBeVisible();
  },
);
