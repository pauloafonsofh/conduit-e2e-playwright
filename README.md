# Conduit E2E with Playwright

Automated end-to-end tests (Playwright, TypeScript) for [Conduit](https://conduit.mate.academy), a public blogging app.
17 smoke cases, each traced to a TestRail case and checked against two realistic bugs injected on purpose (34 mutant tests, 27 distinct mutants), all caught by assertions. A test that still passes when the app is broken is worse than no test.

[![e2e](https://github.com/pauloafonsofh/conduit-e2e-playwright/actions/workflows/e2e.yml/badge.svg?branch=main)](https://github.com/pauloafonsofh/conduit-e2e-playwright/actions/workflows/e2e.yml)
![smoke](https://img.shields.io/endpoint?url=https%3A%2F%2Fpauloafonsofh.github.io%2Fconduit-e2e-playwright%2Fbadges%2Fsmoke.json)
![mutants](https://img.shields.io/endpoint?url=https%3A%2F%2Fpauloafonsofh.github.io%2Fconduit-e2e-playwright%2Fbadges%2Fmutants.json)
![known bugs](https://img.shields.io/endpoint?url=https%3A%2F%2Fpauloafonsofh.github.io%2Fconduit-e2e-playwright%2Fbadges%2Fknown-bugs.json)

The numbers in these badges come from the last CI run on `main`.

**Report:** [HTML report of the last run](https://pauloafonsofh.github.io/conduit-e2e-playwright/)

## Start here

- [Issue #3](https://github.com/pauloafonsofh/conduit-e2e-playwright/issues/3): a real bug this suite found. After an in-app navigation to Home, the tab keeps the title of the previous page.
- [Pull request #5](https://github.com/pauloafonsofh/conduit-e2e-playwright/pull/5): the Settings cases. It shows the whole method in one place: the test bodies, two mutants per case, which assertion caught each mutant, and the decisions written down.

## How to run

```bash
npm ci
npx playwright install chromium
npx playwright test --project=smoke        # 17 TestRail smoke cases and a few infrastructure checks: does the app work?
npx playwright test --project=mutants      # 34 mutant tests: would each smoke test notice a defect?
npx playwright test --project=known-bugs   # known bugs: are they still there?
```

The suite needs **no secrets**: every test creates its own user through the API, and every article a test creates is deleted at the end, even when the test fails. Users cannot be deleted through the Conduit API, so each run leaves its test users behind.

## Traceability with TestRail

Each smoke test starts with its TestRail ID (for example `C71 – ...`). [docs/traceability.md](docs/traceability.md) links every TestRail case to its test file, its mutants, the defect each mutant simulates, and notes where the site differs from the case. How mutants work and what they do not cover: [docs/mutants.md](docs/mutants.md).

## Known bugs: `test.fail()`, not `skip`

A known bug stays in the suite as a test marked `test.fail()`, with a link to its issue. The test keeps running: it passes while the bug exists and fails when the site is fixed, so the suite tells us when to close the issue and put the check back into the smoke case. A skipped test would never run and would never tell us.

## Retries

In CI, a failed smoke test is retried once. The target is a public instance shared with other students, so a slow or busy server can make a test fail once. A retry does not hide a bug: a test that passes only on the second try is reported as **flaky** in the job summary and in the report. Mutant and known-bug tests are never retried.

## Weekly schedule

The full suite runs on every push and pull request. The scheduled run is smoke only, once a week (Monday 08:00, UTC-3), because every run creates users and articles on the shared instance.

## Out of scope

- Regression suites (full Settings regression, feed paging, comments, following, profile pages): this repository covers the smoke run only.
- Other browsers, mobile, visual checks, accessibility and load: Chromium only.
- A separate API test suite: the API is used here only to prepare and clean up test data.
- A mock of the whole site: tests run against the real public instance, so CI fails if it is down.

## How AI was used

I decide what to test, the expected results and the assertions. Claude Code writes most of the code; I review it, run it and check every result.

## See also

[ecommerce-data-quality-lab](https://github.com/pauloafonsofh/ecommerce-data-quality-lab): SQL test suite for a PostgreSQL store with seeded defects.
