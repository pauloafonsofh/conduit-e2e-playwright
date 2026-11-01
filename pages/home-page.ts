// Home page at /. Checked 31/10/2026:
// - signed out: banner "conduit" / "A place to share your knowledge.", only the "Global Feed" tab,
//   articles rendered by the server;
// - signed in: no banner, tabs "Your Feed" (selected, empty for a new user) and "Global Feed",
//   articles loaded from the API when a tab is clicked.
// The signed-out Home is cached by the server for about 10 seconds: an article created by the test
// may not be there yet. To find a fresh article, sign in and click "Global Feed".
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

  constructor(readonly page: Page) {
    this.banner = page.locator('.banner');
    this.feedTabs = page.locator('.feed-toggle');
    this.yourFeedTab = this.feedTabs.getByText('Your Feed', { exact: true });
    this.globalFeedTab = this.feedTabs.getByText('Global Feed', { exact: true });
    this.previews = page.locator('.article-preview');
  }

  async open(): Promise<void> {
    await this.page.goto(HomePage.path);
  }

  /** The preview of the article with this exact title. */
  preview(title: string): Locator {
    return this.previews.filter({ has: this.page.locator('h1', { hasText: `Article title: ${title}` }) });
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
