// Network fault injection: a mutant changes a real response on its way to the browser,
// simulating a plausible defect without touching the application code.
import type { Page } from '@playwright/test';

export type Mutant = {
  id: string;
  description: string;
  install(page: Page): Promise<void>;
};

const DROPPED_HEADERS = ['content-length', 'content-encoding'];

function cleanHeaders(headers: Record<string, string>) {
  return Object.fromEntries(Object.entries(headers).filter(([name]) => !DROPPED_HEADERS.includes(name.toLowerCase())));
}

/** Edit the JSON body of every response whose URL matches. */
export async function tamperJson(page: Page, url: string | RegExp, edit: (body: any) => any): Promise<void> {
  await page.route(url, async route => {
    const response = await route.fetch();
    const body = await response.json();
    await route.fulfill({ response, headers: cleanHeaders(response.headers()), json: edit(body) });
  });
}

/**
 * Edit the HTML of every document whose URL matches. Conduit pages are server-rendered:
 * when a mutant changes data, edit both the visible markup and the JSON inside
 * <script id="__NEXT_DATA__">, because the page hydrates from that block.
 */
export async function tamperDocument(page: Page, url: string | RegExp, edit: (html: string) => string): Promise<void> {
  await page.route(url, async route => {
    if (route.request().resourceType() !== 'document') return route.fallback();
    const response = await route.fetch();
    const html = await response.text();
    await route.fulfill({ response, headers: cleanHeaders(response.headers()), body: edit(html) });
  });
}
