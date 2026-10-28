// Thin client for the Conduit REST API, used only to prepare and clean up test data.
// The instance at conduit.mate.academy follows the RealWorld spec:
// - POST /api/users with { user: { username, email, password } } returns { user: { ..., token } }
// - authenticated calls send the header "Authorization: Token <jwt>"
import { randomBytes } from 'node:crypto';
import type { APIRequestContext } from '@playwright/test';

export const API_URL = process.env.API_URL ?? 'https://conduit.mate.academy/api';

export type TestUser = { username: string; email: string; password: string; token: string };

export type ArticleInput = { title: string; description: string; body: string; tagList: string[] };

export type Article = ArticleInput & { slug: string; author: { username: string } };

export function uniqueName(prefix = 'pqa'): string {
  return `${prefix}-${randomBytes(6).toString('base64url').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8).padEnd(8, '0')}`;
}

function authHeaders(user: TestUser) {
  return { Authorization: `Token ${user.token}` };
}

async function ensureOk(response: Awaited<ReturnType<APIRequestContext['get']>>, action: string) {
  if (!response.ok()) {
    throw new Error(`${action} failed: HTTP ${response.status()} ${await response.text()}`);
  }
}

export async function createUser(request: APIRequestContext): Promise<TestUser> {
  const username = uniqueName();
  const user = { username, email: `${username}@example.com`, password: `Pw-${uniqueName('x')}-9` };
  const response = await request.post(`${API_URL}/users`, { data: { user } });
  await ensureOk(response, `Creating user ${username}`);
  const body = await response.json();
  return { ...user, token: body.user.token };
}

export async function createArticle(
  request: APIRequestContext,
  user: TestUser,
  data: Partial<ArticleInput> = {},
): Promise<Article> {
  const name = uniqueName();
  const article: ArticleInput = {
    title: `Test article ${name}`,
    description: 'Created by an automated test',
    body: 'This article was created by an automated test and is deleted when the test ends.',
    tagList: ['pqa-test'],
    ...data,
  };
  const response = await request.post(`${API_URL}/articles`, {
    data: { article },
    headers: authHeaders(user),
  });
  await ensureOk(response, `Creating article "${article.title}"`);
  return (await response.json()).article;
}

export async function deleteArticle(request: APIRequestContext, user: TestUser, slug: string): Promise<void> {
  const response = await request.delete(`${API_URL}/articles/${slug}`, { headers: authHeaders(user) });
  if (response.status() === 404) return;
  await ensureOk(response, `Deleting article ${slug}`);
}
