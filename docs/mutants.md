# Mutants

Result: 34 mutant tests (27 distinct mutants), all caught by an assertion. Known gaps are listed at the end.

A passing smoke test proves little on its own: a test with weak assertions also passes. So every smoke case has two **mutants**. A mutant injects one plausible defect into the traffic between the browser and the site, then runs the same test body. The defect is simulated in the browser only; the real site is never changed.

## Inverted logic of the `mutants` job

In the `mutants` project, a test **passes when the injected defect makes an assertion fail**. That is what "caught" means. The job fails in two cases:

- the mutant **survives**: the test still passes with the defect, so its assertions are too weak;
- the mutant is **not caught by an assertion**: the test breaks in another way (timeout, navigation error, site down), which proves nothing about the assertions.

`smokeCase()` in `support/smoke-case.ts` builds both tests from one body, and `scripts/verify-harness.mjs` checks this logic on a local page before the real run (a caught mutant passes, a surviving mutant fails, a timeout fails).

## How mutants are applied

| Method | What it changes | Code |
|---|---|---|
| Modify an API response | the JSON of a real response (for example another username) | `tamperJson` |
| Mock an API response | a fixed status and body (for example a 422 error) | `replyJson`, `page.route` |
| Edit the front-end bundle | a line of the shipped JavaScript (for example a route or a redirect) | `tamperScript` |
| Edit the server HTML and page data | the HTML, `__NEXT_DATA__` and `_next/data` JSON, so the page shows the same defect before and after hydration | `tamperDocument`, `mutants/header-links.ts`, `mutants/home.ts`, `mutants/new-article.ts` |

## Mutants and the assertion that caught them (local runs, 2026-11-01)

The CI job summary and the published report show the current result.

| Case | Mutant | Simulated defect | How it is applied | Caught by |
|---|---|---|---|---|
| C1, C69 | `sign-in-returns-other-user` | Sign in succeeds but the API returns another user | Modify API response | `not.toHaveURL` (the app stays on Sign in) |
| C1, C69 | `valid-credentials-rejected` | A valid email and password are rejected | Mock API response (422) | `not.toHaveURL` |
| C46 | `sign-in-link-opens-sign-up` | The "Sign in" header link opens Sign up | Edit HTML and bundle | `toHaveURL` |
| C46 | `sign-in-link-without-label` | The "Sign in" header link has no label | Edit HTML and bundle | `toBeVisible` |
| C5 | `sign-up-link-opens-sign-in` | The "Sign up" header link opens Sign in | Edit HTML and bundle | `toHaveURL` |
| C5 | `sign-up-link-without-label` | The "Sign up" header link has no label | Edit HTML and bundle | `toBeVisible` |
| C10, C44 | `sign-up-saves-other-username` | The account is created with another username | Modify API response | `not.toHaveURL` (the app stays on Sign up) |
| C10, C44 | `new-email-rejected-as-taken` | A new email is rejected as "already taken" | Mock API response (422) | `not.toHaveURL` |
| C71 | `new-article-link-opens-settings` | The "New Article" header link opens Settings | Edit HTML and bundle | `toHaveURL` |
| C71 | `new-article-link-without-label` | The "New Article" header link has no label | Edit HTML and bundle | `toBeVisible` |
| C76, C78, C128 | `article-title-truncated` | The article is saved with its title cut to 10 characters | Modify API response, HTML and page data | `toHaveText` (title) |
| C76 | `article-body-lost` | The article is saved without its body | Modify API response, HTML and page data | `toHaveText` (body) |
| C78 | `publish-redirects-home` | After publishing, the app opens Home instead of the article | Edit bundle (editor redirect) | `toHaveURL` (exact slug) |
| C128 | `publish-rejected` | A valid article is rejected as "title must be unique" | Mock API response (422) | `toHaveURL` |
| C131, C132 | `home-links-broken` | The logo and the "Home" link point to `/home` (404) | Edit HTML and bundle | `toHaveAttribute('href', '/')` |
| C131 | `logo-without-label` | The logo has no label | Edit HTML and bundle | `toBeVisible` |
| C132 | `home-link-without-label` | The "Home" link has no label | Edit HTML and bundle | `toBeVisible` |
| C146 | `preview-opens-other-article` | An article preview opens another article | Edit feed in API, HTML and page data | `toHaveURL` |
| C146 | `preview-shows-other-title` | An article preview shows another title | Edit feed in API, HTML and page data | `toBeVisible` (exact preview title) |
| C153 | `like-not-saved` | The like is shown but never reaches the server | Mock API response (200) | `toContainClass('btn-primary')` after the reload |
| C153 | `like-rejected` | The like is rejected as unauthorized | Mock API response (401) | `toContainClass` |
| C164 | `settings-link-opens-new-article` | The "Settings" header link opens New Article | Edit HTML and bundle | `toHaveURL` |
| C164 | `settings-link-without-label` | The "Settings" header link has no label | Edit HTML and bundle | `toBeVisible` |
| C210 | `settings-not-saved` | Update Settings returns success but nothing is saved | Mock API response (200) | `toHaveText` (bio on the profile, before the reload) |
| C210 | `settings-rejected` | A valid update is rejected as "email has already been taken" | Mock API response (422) | `expect(response.status()).toBe(200)` |
| C212 | `logout-keeps-session` | Logout does not end the session | Edit bundle (logout code) | `toBeVisible` ("Sign in", after the reload) |
| C212 | `logout-header-stale` | The header keeps showing the user until a reload | Edit bundle (logout code) | `toBeVisible` ("Sign in", before the reload) |

17 cases, 34 mutant tests (27 distinct mutants; some are shared by cases with the same flow).

## Known gaps

- **Checks no mutant exercises yet.** In C1, C69, C10 and C44, the `toHaveText` on the username in the header is never reached by a mutant: with a wrong username the app does not leave the form, so `not.toHaveURL` fails first. In C210, no mutant reaches the check after the reload (`settings-not-saved` is caught before it). In C212, only `logout-keeps-session` reaches it. These assertions stay as cheap protection, but they are not proven.
- **Mutants tied to the front-end build.** Mutants that edit the bundle or a chunk name (`publish-redirects-home` uses `480-*.js`, the logout mutants use minified code) stop applying if the site is redeployed with a new build. They then fail as "not caught" or "survived", so CI turns red instead of passing silently, and the pattern needs an update.
- **Defects are simulated in the browser.** A mutant shows that a test would notice a wrong response from the server; it does not test the server itself (validation rules, persistence) beyond what the UI shows.
- **Single-article feed.** C146 and C153 read the feed of a unique tag, which has one article. The feed mutants therefore point the slug to an article that does not exist or add "(old version)" to the title, instead of swapping two articles (comment in `mutants/home.ts`).
- **Known bug #3.** C131 and C132 do not check the tab title, because the site keeps the previous title after in-app navigation ([issue #3](https://github.com/pauloafonsofh/conduit-e2e-playwright/issues/3)). No mutant covers the title.
- **Scope.** Mutants cover the 17 smoke cases only, not a regression suite.
