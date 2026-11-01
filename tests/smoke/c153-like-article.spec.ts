// C153 – Logged-in user should be able to like an article by clicking the "Like" button
// Area: Home. Source: TestRail project Conduit, run R4 "Smoke Test Run 22/10/2026".
//
// TestRail has the title only (checklist case, no steps). The title is the expected result.

import { smokeCase } from '../../support/smoke-case';
import { expect } from '../../support/fixtures';
import { createArticle, uniqueName } from '../../support/api';
import { HomePage } from '../../pages/home-page';
import { likeNotSaved, likeRejected } from '../../mutants/home';

smokeCase(
  'C153',
  'Logged-in user should be able to like an article by clicking the "Like" button',
  { mutants: [likeNotSaved, likeRejected] },
  async ({ authedPage, request, user, articles }) => {
    const home = new HomePage(authedPage);
    const title = uniqueName('Like article');
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
    const like = home.likeButton(title);
    await expect(like).toBeVisible();
    // The counter is public on a shared instance: other users may like the article at any time,
    // so the test checks this user's like by the button state and the counter only relatively.
    await expect(like).toContainClass('btn-outline-primary');
    const before = Number((await like.textContent())?.trim());

    const favorited = authedPage
      .waitForResponse(r => r.request().method() === 'POST' && new RegExp(`/api/articles/${slug}/favorite/?$`).test(r.url()), { timeout: 10_000 })
      .catch(() => null);
    await like.click();
    await expect(like).toContainClass('btn-primary');
    await expect.poll(async () => Number((await like.textContent())?.trim())).toBeGreaterThanOrEqual(before + 1);
    const favResp = await favorited;
    expect(favResp, 'favorite request was not sent').not.toBeNull();
    expect(favResp!.ok(), `favorite status ${favResp!.status()}`).toBe(true);

    await authedPage.reload();
    await expect(home.popularTag(tag)).toBeVisible();
    await home.popularTag(tag).click();
    await expect(like).toContainClass('btn-primary');
  },
);
