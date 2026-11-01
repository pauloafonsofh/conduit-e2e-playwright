// Candidate mutants for the Settings area (C164, C210, C212). Each one simulates a plausible
// defect; Paulo picks at least one per case.
import { replyJson, tamperScript, type Mutant } from '../support/network-faults';
import { headerLinkOpens, headerLinkWithoutLabel } from './header-links';

// Logout code in the settings page bundle (checked 01/11/2026): it removes the stored user and the
// "auth" cookie, clears the user in memory, then opens Home. If a new build changes this text, the
// mutant request fails and the mutant run turns red: update the strings.
const SETTINGS_BUNDLE = /\/_next\/static\/chunks\/pages\/settings-[^/]+\.js$/;
const LOGOUT_CLEARS_SESSION = 'window.localStorage.removeItem("user"),(0,c.kT)("auth"),(0,u.JG)("user",null),';
const LOGOUT_REFRESHES_USER = '(0,u.JG)("user",null),a.default.push("/").then((function(){return(0,u.X$)("user")}))';

export const settingsLinkOpensNewArticle: Mutant = {
  id: 'settings-link-opens-new-article',
  description: 'The "Settings" link in the header opens the New Article page',
  install: page => headerLinkOpens(page, 'settings', 'newArticle'),
};

export const settingsLinkWithoutLabel: Mutant = {
  id: 'settings-link-without-label',
  description: 'The "Settings" link in the header has no label, so users cannot find it',
  install: page => headerLinkWithoutLabel(page, 'settings'),
};

export const settingsNotSaved: Mutant = {
  id: 'settings-not-saved',
  description: 'Update Settings answers success but the change never reaches the server',
  install: async page => {
    await page.route('**/api/user', async route => {
      if (route.request().method() !== 'PUT') return route.fallback();
      const sent = route.request().postDataJSON()?.user ?? {};
      const token = (route.request().headers()['authorization'] ?? '').replace(/^Token /, '');
      await route.fulfill({ status: 200, json: { user: { ...sent, token } } });
    });
  },
};

export const settingsRejected: Mutant = {
  id: 'settings-rejected',
  description: 'A valid settings update is rejected with "email has already been taken"',
  install: page => replyJson(page, '**/api/user', 422, { errors: { body: ['email has already been taken'] } }),
};

export const logoutKeepsSession: Mutant = {
  id: 'logout-keeps-session',
  description: 'Logout opens Home but does not end the session: the user is still signed in',
  install: page => tamperScript(page, SETTINGS_BUNDLE, LOGOUT_CLEARS_SESSION, ''),
};

// "Logout opens the wrong page" is not used: the settings page sends a signed-out user to "/"
// by itself, so that defect cannot reach the user on this site (seen 01/11/2026).
export const logoutHeaderStale: Mutant = {
  id: 'logout-header-stale',
  description: 'Logout ends the session but the header keeps showing the user until the page is reloaded',
  install: page => tamperScript(page, SETTINGS_BUNDLE, LOGOUT_REFRESHES_USER, 'a.default.push("/")'),
};
