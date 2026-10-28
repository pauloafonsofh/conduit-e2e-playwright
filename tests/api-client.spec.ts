import { test, expect } from '../support/fixtures';
import { API_URL, createUser, createArticle, deleteArticle } from '../support/api';

test.describe('API client and fixtures', { tag: '@infra' }, () => {
  test('two users created in parallel never collide', async ({ request }) => {
    const [a, b] = await Promise.all([createUser(request), createUser(request)]);

    expect(a.username).toMatch(/^pqa-/);
    expect(b.username).toMatch(/^pqa-/);
    expect(a.username).not.toBe(b.username);
    expect(a.email).not.toBe(b.email);
    expect(a.token).not.toBe('');
    expect(b.token).not.toBe('');
  });

  test('a deleted article is gone from the API', async ({ request, user }) => {
    const article = await createArticle(request, user);
    await deleteArticle(request, user, article.slug);

    const response = await request.get(`${API_URL}/articles/${article.slug}`);
    expect(response.status()).toBe(404);
  });

  test('authedPage is signed in as the fixture user', async ({ authedPage, user }) => {
    await authedPage.goto('/');

    await expect(authedPage.getByRole('navigation')).toContainText(user.username);
    await expect(authedPage.getByRole('link', { name: 'Settings' })).toBeVisible();
  });
});
