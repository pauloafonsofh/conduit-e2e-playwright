// Header link defects shared by the Sign In and Sign Up areas. The header is server-rendered
// and then hydrated by React, so each mutant changes both the HTML and the front-end bundle:
// a click before or after hydration meets the same defect.
import type { Page } from '@playwright/test';
import { tamperDocument, tamperScript } from '../support/network-faults';

const APP_BUNDLE = /\/_next\/static\/chunks\/pages\/_app-[^/]+\.js$/;

const ROUTE_KEY = { login: 'userLogin', register: 'userNew' } as const;
const LABEL = { login: 'Sign in', register: 'Sign up' } as const;

type AuthPage = keyof typeof ROUTE_KEY;

/** The header link that should open `from` opens `to` instead. */
export async function headerLinkOpens(page: Page, from: AuthPage, to: AuthPage): Promise<void> {
  const label = LABEL[from];
  await tamperDocument(page, '**/*', html =>
    html.replace(new RegExp(`href="/user/${from}">${label}</a>`, 'g'), `href="/user/${to}">${label}</a>`),
  );
  await tamperScript(
    page,
    APP_BUNDLE,
    `${ROUTE_KEY[from]}:function(){return"/user/${from}"}`,
    `${ROUTE_KEY[from]}:function(){return"/user/${to}"}`,
  );
}

/** The header shows the link for `which` without its label, so users cannot find it. */
export async function headerLinkWithoutLabel(page: Page, which: AuthPage): Promise<void> {
  const label = LABEL[which];
  await tamperDocument(page, '**/*', html => html.replace(new RegExp(`>${label}</a>`, 'g'), '></a>'));
  await tamperScript(page, APP_BUNDLE, `children:"${label}"}`, 'children:""}');
}
