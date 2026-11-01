// Header link defects shared by several areas. The header is server-rendered and then
// hydrated by React, so each mutant changes both the HTML and the front-end bundle:
// a click before or after hydration meets the same defect.
import type { Page } from '@playwright/test';
import { tamperDocument, tamperScript } from '../support/network-faults';

export const APP_BUNDLE = /\/_next\/static\/chunks\/pages\/_app-[^/]+\.js$/;

// routeKey: name of the route function in the bundle's route table.
// bundleLabel / bundleEmpty: the link label as written in the bundle, and the same text without the label.
// The logo and the Home link share the "home" route; the logo label comes from the app name.
const LINKS = {
  home: { routeKey: 'home', path: '/', label: 'Home', bundleLabel: 'children:"Home"', bundleEmpty: 'children:""' },
  logo: { routeKey: 'home', path: '/', label: 'conduit', bundleLabel: 'children:p.appName.toLowerCase()', bundleEmpty: 'children:""' },
  login: { routeKey: 'userLogin', path: '/user/login', label: 'Sign in', bundleLabel: '"Sign in"', bundleEmpty: '""' },
  register: { routeKey: 'userNew', path: '/user/register', label: 'Sign up', bundleLabel: '"Sign up"', bundleEmpty: '""' },
  newArticle: { routeKey: 'articleNew', path: '/editor', label: 'New Article', bundleLabel: '"\\xa0New Article"', bundleEmpty: '"\\xa0"' },
  settings: { routeKey: 'userEdit', path: '/settings', label: 'Settings', bundleLabel: '"\\xa0Settings"', bundleEmpty: '"\\xa0"' },
} as const;

type HeaderLink = keyof typeof LINKS;

/** The header link that should open `from` opens another page: a header link, or any path. */
export async function headerLinkOpens(page: Page, from: HeaderLink, to: HeaderLink | `/${string}`): Promise<void> {
  const source = LINKS[from];
  const targetPath = to.startsWith('/') ? to : LINKS[to as HeaderLink].path;
  await tamperDocument(page, '**/*', html => html.replaceAll(`href="${source.path}"`, `href="${targetPath}"`));
  await tamperScript(
    page,
    APP_BUNDLE,
    `${source.routeKey}:function(){return"${source.path}"}`,
    `${source.routeKey}:function(){return"${targetPath}"}`,
  );
}

/** The header shows the link without its label, so users cannot find it. */
export async function headerLinkWithoutLabel(page: Page, which: HeaderLink): Promise<void> {
  const link = LINKS[which];
  await tamperDocument(page, '**/*', html => html.replaceAll(`${link.label}</a>`, '</a>'));
  await tamperScript(page, APP_BUNDLE, link.bundleLabel, link.bundleEmpty);
}
