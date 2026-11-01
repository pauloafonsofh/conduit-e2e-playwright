// Publish an article from the editor and track it for cleanup.
// The slug comes from the POST /api/articles response, not from the URL: if the app never
// reaches the article page (wrong redirect), the article created on the server is still deleted.
import type { Page } from '@playwright/test';
import type { ArticleInput } from './api';
import type { Fixtures } from './fixtures';
import { EditorPage } from '../pages/editor-page';

/** Returns the slug of the created article, or undefined if the API did not create it. */
export async function publishAndTrack(
  page: Page,
  articles: Fixtures['articles'],
  data: Partial<ArticleInput>,
): Promise<string | undefined> {
  const created = page
    .waitForResponse(r => r.request().method() === 'POST' && /\/api\/articles\/?$/.test(r.url()), { timeout: 15_000 })
    .catch(() => null);
  await new EditorPage(page).publish(data);
  const response = await created;
  if (!response?.ok()) return undefined;
  const slug: string = (await response.json()).article.slug;
  articles.track(slug);
  return slug;
}
