import { defineConfig } from '@playwright/test';

const PORT = 4599;

export default defineConfig({
  testDir: './fixtures',
  outputDir: './test-results/artifacts',
  reporter: [['json', { outputFile: './test-results/results.json' }]],
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: 'node server.mjs',
    url: `http://localhost:${PORT}/page`,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'smoke', grep: /@smoke/ },
    { name: 'mutants', grep: /@mutant/ },
  ],
});
