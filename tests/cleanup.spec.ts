// Focus 5 of the plan: an article created by a test that fails halfway is still deleted,
// because the `articles` fixture deletes every tracked article in its teardown.
import { test, expect } from '../support/fixtures';
import { API_URL, createArticle, uniqueName } from '../support/api';
import { publishAndTrack } from '../support/publish';
import { EditorPage } from '../pages/editor-page';
import { ArticlePage } from '../pages/article-page';
import { publishRedirectsHome } from '../mutants/new-article';

test.describe('article cleanup', { tag: '@infra' }, () => {
  test.describe.configure({ mode: 'serial' });

  const slugs: Record<string, string | undefined> = {};

  test('an article tracked by a failing test is deleted anyway', async ({ request, user, articles }) => {
    test.fail();
    const article = await createArticle(request, user);
    slugs.failingTest = article.slug;
    articles.track(article.slug);
    expect(article.slug, 'forced failure after the article was tracked').toBe('');
  });

  // The app creates the article but never opens its page, so the slug can only come from the
  // API response. If the redirect mutant stops applying, the page opens, this test passes and
  // test.fail() turns it red.
  test('an article published without reaching its page is deleted anyway', async ({ authedPage, articles }) => {
    test.fail();
    await publishRedirectsHome.install(authedPage);
    const editor = new EditorPage(authedPage);
    await editor.open();
    slugs.noArticlePage = await publishAndTrack(authedPage, articles, {
      title: `Cleanup ${uniqueName()}`,
      description: 'Cleanup check',
      body: 'Created by the cleanup test and deleted in the teardown.',
    });
    await expect(authedPage, 'forced failure: the redirect mutant keeps the user away').toHaveURL(ArticlePage.pathPattern, {
      timeout: 5_000,
    });
  });

  test.afterAll(async ({ playwright }) => {
    const api = await playwright.request.newContext();
    for (const [name, slug] of Object.entries({ failingTest: slugs.failingTest, noArticlePage: slugs.noArticlePage })) {
      expect(slug, `${name}: no article was created`).toBeDefined();
      const response = await api.get(`${API_URL}/articles/${slug}`);
      expect(response.status(), `${name}: article ${slug} is still there after the teardown`).toBe(404);
    }
    await api.dispose();
  });
});
