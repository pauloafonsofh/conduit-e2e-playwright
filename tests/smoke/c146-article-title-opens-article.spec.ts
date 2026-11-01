// C146 – User should be redirected to the Article page after clicking the article title in the preview
// Area: Home. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { createArticle, uniqueName } from '../../support/api';
import { HomePage } from '../../pages/home-page';
import { ArticlePage } from '../../pages/article-page';
import { previewOpensOtherArticle, previewShowsOtherTitle } from '../../mutants/home';

smokeCase(
  'C146',
  'User should be redirected to the Article page after clicking the article title in the preview',
  { mutants: [previewOpensOtherArticle, previewShowsOtherTitle] },
  async ({ authedPage, request, user, articles }) => {
    const home = new HomePage(authedPage);
    const article = new ArticlePage(authedPage);
    const title = uniqueName('Preview article');
    // A unique tag: the tag feed shows only this article, while the Global Feed shows only the
    // 10 newest articles and other users publish on the same instance during the run.
    const tag = uniqueName('pqa-tag');

    // Created by the same user as authedPage (both use the `user` fixture of this test).
    const { slug } = await createArticle(request, user, {
      title,
      description: uniqueName('Description'),
      body: uniqueName('Body'),
      tagList: [tag],
    });
    articles.track(slug);

    await authedPage.goto('/');
    await expect(home.popularTag(tag)).toBeVisible();
    await home.popularTag(tag).click();
    await expect(home.previewTitle(title)).toBeVisible();
    await home.previewTitle(title).click();
    await expect(authedPage).toHaveURL(new RegExp(`/article/${slug}/?$`));
    await expect(article.title).toHaveText(title);
  },
);
