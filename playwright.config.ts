import { defineConfig, devices } from '@playwright/test';

export const BASE_URL = process.env.BASE_URL ?? 'https://conduit.mate.academy';

export default defineConfig({
  testDir: './tests',
  globalSetup: './global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
  projects: [
    {
      name: 'smoke',
      grep: /@smoke|@infra/,
      retries: process.env.CI ? 1 : 0,
    },
    {
      name: 'mutants',
      grep: /@mutant/,
      retries: 0,
    },
    {
      // Bugs found in the site, each with a GitHub issue. Tests use test.fail(), so they pass
      // while the bug exists and fail when it is fixed.
      name: 'known-bugs',
      grep: /@known-bug/,
      retries: 0,
    },
  ],
});
