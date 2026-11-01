## E2E summary

| Check | Result |
|---|---|
| Smoke cases (TestRail) | 2/3 passed |
| Infra tests | 1/1 passed |
| Mutants | 1/3 caught by an assertion |
| Known bugs still present | 1/2 |
| Flaky (passed on retry) | 1 |

### Smoke cases that failed

- C5 – sign up page fails: expect(page).toHaveURL(expected) failed

### Mutants not caught by an assertion

- C1 – sign in passes [mutant: survives]: Error: Mutant survives survived: the test did not detect the injected defect (x)
- C1 – sign in passes [mutant: timeout]: Error: Mutant timeout not caught by an assertion: locator.click: Timeout 30000ms exceeded.

### Known bugs that look fixed (the test.fail() test passed): check the site and close the issue

- Other bug fixed by the site https://github.com/example/repo/issues/9

### Flaky tests

- [smoke] C10 – sign up is flaky
