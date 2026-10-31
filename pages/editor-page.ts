// "New article" editor at /editor. Title, description and body are required (checked
// 31/10/2026: the form shows "Article description cannot be empty" / "Article body cannot
// be empty" without calling the API); tags are optional.
import type { Locator, Page } from '@playwright/test';
import type { ArticleInput } from '../support/api';

export class EditorPage {
  static readonly path = '/editor';

  readonly title: Locator;
  readonly description: Locator;
  readonly body: Locator;
  readonly tags: Locator;
  readonly publishButton: Locator;
  readonly errors: Locator;

  constructor(readonly page: Page) {
    this.title = page.getByRole('textbox', { name: 'Article Title' });
    this.description = page.getByRole('textbox', { name: "What's this article about?" });
    this.body = page.getByRole('textbox', { name: 'Write your article (in markdown)' });
    this.tags = page.getByRole('textbox', { name: 'Enter tags' });
    this.publishButton = page.getByRole('button', { name: 'Publish Article' });
    this.errors = page.locator('.error-messages');
  }

  async open(): Promise<void> {
    await this.page.goto(EditorPage.path);
  }

  /** Fill the form. Tags are typed one by one, each followed by Enter. */
  async fill(article: Partial<ArticleInput>): Promise<void> {
    if (article.title !== undefined) await this.title.fill(article.title);
    if (article.description !== undefined) await this.description.fill(article.description);
    if (article.body !== undefined) await this.body.fill(article.body);
    for (const tag of article.tagList ?? []) {
      await this.tags.fill(tag);
      await this.tags.press('Enter');
    }
  }

  async publish(article: Partial<ArticleInput>): Promise<void> {
    await this.fill(article);
    await this.publishButton.click();
  }
}
