// Article page at /article/<slug>. The description is not shown on this page.
import type { Locator, Page } from '@playwright/test';

export class ArticlePage {
  static readonly pathPattern = /\/article\/[^/]+$/;

  readonly title: Locator;
  readonly body: Locator;
  readonly tags: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;

  constructor(readonly page: Page) {
    this.title = page.getByRole('heading', { level: 1 });
    this.body = page.locator('.article-content');
    this.tags = page.locator('.article-content .tag-list li');
    this.editButton = page.getByRole('link', { name: 'Edit Article' }).first();
    this.deleteButton = page.getByRole('button', { name: 'Delete Article' }).first();
  }

  /** Author link in the article header (the page shows the author twice). */
  author(username: string): Locator {
    return this.page.locator('.article-meta').first().getByRole('link', { name: username, exact: true });
  }

  /** Slug of the article currently open, taken from the URL. Use it to track the article for cleanup. */
  slug(): string {
    const match = new URL(this.page.url()).pathname.match(/^\/article\/([^/]+)$/);
    if (!match) throw new Error(`Not on an article page: ${this.page.url()}`);
    return match[1];
  }
}
