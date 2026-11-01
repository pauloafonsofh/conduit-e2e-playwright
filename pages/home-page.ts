// Home page at /. Checked 31/10/2026:
// - signed out: banner "conduit" / "A place to share your knowledge.", only the "Global Feed" tab,
//   articles rendered by the server;
// - signed in: no banner, tabs "Your Feed" (selected, empty for a new user) and "Global Feed",
//   articles loaded from the API when a tab is clicked.
// The signed-out Home is cached by the server for about 10 seconds: an article created by the test
// may not be there yet. To find a fresh article, sign in and click "Global Feed".
// Tag feed: signed in, "Popular Tags" comes from /api/tags (newest tag first, no server cache);
// clicking a tag adds a third tab and loads /api/articles?tag=<tag>. The URL stays /, so after a
// reload the tag has to be clicked again.
// The preview shows its title and description with visible prefixes:
// "Article title: <title>" and "Article description: <description>".
import type { Locator, Page } from '@playwright/test';

export class HomePage {
  static readonly path = '/';

  readonly banner: Locator;
  readonly feedTabs: Locator;
  readonly yourFeedTab: Locator;
  readonly globalFeedTab: Locator;
  readonly previews: Locator;
  readonly popularTags: Locator;

  constructor(readonly page: Page) {
    this.banner = page.locator('.banner');
    this.feedTabs = page.locator('.feed-toggle');
    this.yourFeedTab = this.feedTabs.getByText('Your Feed', { exact: true });
    this.globalFeedTab = this.feedTabs.getByText('Global Feed', { exact: true });
    this.previews = page.locator('.article-preview');
    this.popularTags = page.locator('.sidebar .tag-pill');
  }

  async open(): Promise<void> {
    await this.page.goto(HomePage.path);
  }

  /** A tag in "Popular Tags"; clicking it opens the feed of that tag. */
  popularTag(tag: string): Locator {
    return this.popularTags.getByText(tag, { exact: true });
  }

  /** The preview of the article with this exact title (the whole h1 text must match). */
  preview(title: string): Locator {
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.previews.filter({ has: this.page.locator('h1', { hasText: new RegExp(`^Article title: ${escaped}$`) }) });
  }

  /** The title (h1) inside the preview; clicking it opens the article. */
  previewTitle(title: string): Locator {
    return this.preview(title).locator('.preview-link h1');
  }

  /** The like button in the preview; its text is the number of likes. */
  likeButton(title: string): Locator {
    return this.preview(title).locator('.article-meta button');
  }
}
