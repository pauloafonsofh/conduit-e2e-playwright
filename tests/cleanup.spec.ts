// Focus 5 of the plan: an article created by a test that fails halfway is still deleted,
// because the `articles` fixture deletes every tracked article in its teardown.
import { test, expect } from '../support/fixtures';
import { API_URL, createArticle } from '../support/api';

test.describe('article cleanup', { tag: '@infra' }, () => {
  test.describe.configure({ mode: 'serial' });

  let slug: string | undefined;

  test('an article tracked by a failing test is deleted anyway', async ({ request, user, articles }) => {
    test.fail();
    const article = await createArticle(request, user);
    slug = article.slug;
    articles.track(slug);
    expect(slug, 'forced failure after the article was tracked').toBe('');
  });

  test.afterAll(async ({ playwright }) => {
    expect(slug, 'the failing test did not create an article').toBeDefined();
    const api = await playwright.request.newContext();
    const response = await api.get(`${API_URL}/articles/${slug}`);
    await api.dispose();
    expect(response.status(), `article ${slug} is still there after the teardown`).toBe(404);
  });
});
