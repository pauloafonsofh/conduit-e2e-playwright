// Candidate mutants for the Home area (C131, C132, C146, C153). Each one simulates a
// plausible defect; Paulo picks at least one per case.
//
// The feed reaches the browser in three ways: the API (/api/articles?..., /api/articles/feed?...),
// the page data (_next/data/.../index.json) and the server-rendered HTML (__NEXT_DATA__). The tabs
// first show the server data and then the API answer, so a feed defect changes all three; changing
// only the API let a test click the real preview before the API answer arrived (seen 01/11/2026).
// The server caches the Home for about 10 seconds, so a test cannot rely on the server data to show
// an article created a moment before.
import type { Page } from '@playwright/test';
import { tamperDocument, tamperJson, type Mutant } from '../support/network-faults';
import { headerLinkOpens, headerLinkWithoutLabel } from './header-links';

const FEED_API = /\/api\/articles(\/feed)?\?/;
const HOME_DATA = /\/_next\/data\/[^/]+\/index\.json/;
const HOME_DOCUMENT = /^https?:\/\/[^/]+\/(\?.*)?$/;
const FAVORITE_API = /\/api\/articles\/[^/]+\/favorite$/;

type FeedArticle = { slug: string; title: string; [key: string]: unknown };

/**
 * Each article in the feed takes `field` from the next one, so every preview shows or links the
 * wrong article.
 *
 * Why there is a single-article branch (01/11/2026): C146 and C153 moved from the Global Feed to
 * the feed of a unique tag, because the Global Feed shows only the 10 newest articles and other
 * users publish during a run. That feed has one article, so there is no neighbour to rotate with,
 * and without this branch the feed would arrive unchanged and the mutants would not inject anything.
 * The branch adapts the mutant to the new scenario, not to the test: each mutant still simulates
 * the same defect, with the only data a one-article feed offers:
 * - slug ("preview opens another article"): the preview links to an article that is not the one
 *   shown (here, a slug that does not exist);
 * - title ("preview shows another title"): the preview shows a title that is not the article's
 *   current title (here, the title with " (old version)").
 */
function rotate(articles: FeedArticle[], field: 'slug' | 'title'): FeedArticle[] {
  if (articles.length === 1) {
    const [only] = articles;
    return [{ ...only, [field]: field === 'slug' ? `${only.slug}-missing` : `${only.title} (old version)` }];
  }
  return articles.map((article, i) => ({ ...article, [field]: articles[(i + 1) % articles.length][field] }));
}

async function feedChanged(page: Page, field: 'slug' | 'title'): Promise<void> {
  await tamperJson(page, FEED_API, body => ({ ...body, articles: rotate(body.articles, field) }));
  await tamperJson(page, HOME_DATA, body => ({
    ...body,
    pageProps: { ...body.pageProps, articles: rotate(body.pageProps.articles, field) },
  }));
  await tamperDocument(page, HOME_DOCUMENT, html =>
    html.replace(/(<script id="__NEXT_DATA__" type="application\/json">)(.*?)(<\/script>)/s, (_, open, json, close) => {
      const data = JSON.parse(json);
      data.props.pageProps.articles = rotate(data.props.pageProps.articles, field);
      return open + JSON.stringify(data) + close;
    }),
  );
}

export const homeLinksBroken: Mutant = {
  id: 'home-links-broken',
  description: 'The logo and the "Home" link in the header point to /home, a page that does not exist',
  install: page => headerLinkOpens(page, 'home', '/home'),
};

export const logoWithoutLabel: Mutant = {
  id: 'logo-without-label',
  description: 'The "conduit" logo in the header has no label, so users cannot find it',
  install: page => headerLinkWithoutLabel(page, 'logo'),
};

export const homeLinkWithoutLabel: Mutant = {
  id: 'home-link-without-label',
  description: 'The "Home" link in the header has no label, so users cannot find it',
  install: page => headerLinkWithoutLabel(page, 'home'),
};

export const previewOpensOtherArticle: Mutant = {
  id: 'preview-opens-other-article',
  description: 'Clicking an article preview opens a different article',
  install: page => feedChanged(page, 'slug'),
};

export const previewShowsOtherTitle: Mutant = {
  id: 'preview-shows-other-title',
  description: 'Each article preview shows the title of a different article',
  install: page => feedChanged(page, 'title'),
};

export const likeNotSaved: Mutant = {
  id: 'like-not-saved',
  description: 'The like is shown as done but never reaches the server, so it is gone after a reload',
  install: async page => {
    await page.route(FAVORITE_API, route =>
      route.request().method() === 'POST' ? route.fulfill({ status: 200, json: { article: { favorited: true } } }) : route.fallback(),
    );
  },
};

export const likeRejected: Mutant = {
  id: 'like-rejected',
  description: 'The like of a signed-in user is rejected as unauthorized',
  install: async page => {
    await page.route(FAVORITE_API, route =>
      route.request().method() === 'POST'
        ? route.fulfill({ status: 401, json: { errors: { message: ['missing authorization credentials'] } } })
        : route.fallback(),
    );
  },
};
