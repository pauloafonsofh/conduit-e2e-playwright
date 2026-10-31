// Candidate mutants for the New Article area (C71, C76, C78, C128). Each one simulates a
// plausible defect; Paulo picks at least one per case.
//
// The article page reads the article from two places: the page data (_next/data/.../article/<slug>.json,
// pageProps.article) and the API (/api/articles/<slug>). A "saved wrong" defect changes both,
// plus the server-rendered HTML, as if the server had stored the wrong value.
import type { Page } from '@playwright/test';
import { replyJson, tamperDocument, tamperJson, tamperScript, type Mutant } from '../support/network-faults';
import { headerLinkOpens, headerLinkWithoutLabel } from './header-links';

const ARTICLE_DATA = /\/_next\/data\/[^/]+\/article\/[^/]+\.json/;
const ARTICLE_API = /\/api\/articles\/[^/?]+$/;
const ARTICLE_DOCUMENT = /\/article\/[^/?]+$/;

async function storedArticleChanged(page: Page, edit: (article: any) => any): Promise<void> {
  await tamperJson(page, ARTICLE_DATA, body => ({ ...body, pageProps: { ...body.pageProps, article: edit(body.pageProps.article) } }));
  await tamperJson(page, ARTICLE_API, body => ({ ...body, article: edit(body.article) }));
  await tamperDocument(page, ARTICLE_DOCUMENT, html =>
    html.replace(/(<script id="__NEXT_DATA__" type="application\/json">)(.*?)(<\/script>)/s, (_, open, json, close) => {
      const data = JSON.parse(json);
      const before = data.props.pageProps.article;
      data.props.pageProps.article = edit(before);
      return open + JSON.stringify(data) + close;
    }),
  );
}

export const newArticleLinkOpensSettings: Mutant = {
  id: 'new-article-link-opens-settings',
  description: 'The "New Article" link in the header opens the Settings page',
  install: page => headerLinkOpens(page, 'newArticle', 'settings'),
};

export const newArticleLinkWithoutLabel: Mutant = {
  id: 'new-article-link-without-label',
  description: 'The "New Article" link in the header has no label, so users cannot find it',
  install: page => headerLinkWithoutLabel(page, 'newArticle'),
};

export const articleTitleTruncated: Mutant = {
  id: 'article-title-truncated',
  description: 'The article is saved with its title cut to the first 10 characters',
  install: page => storedArticleChanged(page, article => ({ ...article, title: article.title.slice(0, 10) })),
};

export const articleBodyLost: Mutant = {
  id: 'article-body-lost',
  description: 'The article is saved without its body',
  install: page => storedArticleChanged(page, article => ({ ...article, body: '' })),
};

export const publishRejected: Mutant = {
  id: 'publish-rejected',
  description: 'A valid new article is rejected with "title must be unique"',
  install: page => replyJson(page, '**/api/articles', 422, { errors: { title: ['must be unique'] } }),
};

// The editor redirects with its own push("/article/" + slug) in a shared chunk (480-*.js on
// 31/10/2026), not through the route table. If a new build renames the chunk, this mutant
// survives and the mutant run turns red: update the pattern.
const EDITOR_SUBMIT_CHUNK = /\/_next\/static\/chunks\/480-[^/]+\.js$/;

export const publishRedirectsHome: Mutant = {
  id: 'publish-redirects-home',
  description: 'After publishing, the user lands on the Home page instead of the new article',
  install: page =>
    tamperScript(page, EDITOR_SUBMIT_CHUNK, 'push("/article/".concat(r.article.slug))', 'push("/")'),
};
