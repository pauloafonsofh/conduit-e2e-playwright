// Reads the Playwright JSON report and prints a Markdown summary for the CI job page:
// smoke cases from TestRail, infra tests, mutants caught, known bugs still present, flaky tests.
// Usage: node scripts/summary.mjs [path to results.json]   (default: test-results/results.json)
import { readFileSync } from 'node:fs';

const path = process.argv[2] ?? 'test-results/results.json';
const report = JSON.parse(readFileSync(path, 'utf8'));

const stripAnsi = text => text.replace(/\x1b\[[0-9;]*m/g, '');
const firstLine = text => stripAnsi(text ?? '').split('\n').find(line => line.trim() !== '')?.trim() ?? '';

const tests = [];
const walk = suite => {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests) {
      const last = test.results.at(-1);
      tests.push({
        project: test.projectName,
        title: spec.title,
        status: test.status, // expected | unexpected | flaky | skipped
        annotations: [...(test.annotations ?? []), ...(last?.annotations ?? [])],
        error: firstLine(last?.errors?.[0]?.message),
      });
    }
  }
  for (const child of suite.suites ?? []) walk(child);
};
report.suites.forEach(walk);

const ok = t => t.status === 'expected' || t.status === 'flaky';
const isCase = t => /^C\d+ /.test(t.title);

const smoke = tests.filter(t => t.project === 'smoke' && isCase(t));
const infra = tests.filter(t => t.project === 'smoke' && !isCase(t));
const mutants = tests.filter(t => t.project === 'mutants');
const knownBugs = tests.filter(t => t.project === 'known-bugs');
const flaky = tests.filter(t => t.status === 'flaky');
const issueOf = t => t.annotations.find(a => a.type === 'issue')?.description ?? '';

const lines = [
  '## E2E summary',
  '',
  '| Check | Result |',
  '|---|---|',
  `| Smoke cases (TestRail) | ${smoke.filter(ok).length}/${smoke.length} passed |`,
  `| Infra tests | ${infra.filter(ok).length}/${infra.length} passed |`,
  `| Mutants | ${mutants.filter(ok).length}/${mutants.length} caught by an assertion |`,
  `| Known bugs still present | ${knownBugs.filter(ok).length}/${knownBugs.length} |`,
  `| Flaky (passed on retry) | ${flaky.length} |`,
];

const section = (title, items, render) => {
  if (items.length === 0) return;
  lines.push('', `### ${title}`, '', ...items.map(render));
};

section('Smoke cases that failed', smoke.filter(t => !ok(t)), t => `- ${t.title}: ${t.error}`);
section('Infra tests that failed', infra.filter(t => !ok(t)), t => `- ${t.title}: ${t.error}`);
section('Mutants not caught by an assertion', mutants.filter(t => !ok(t)), t => `- ${t.title}: ${t.error}`);
section(
  'Known bugs that look fixed (the test.fail() test passed): check the site and close the issue',
  knownBugs.filter(t => !ok(t)),
  t => `- ${t.title} ${issueOf(t)}`.trimEnd(),
);
section('Flaky tests', flaky, t => `- [${t.project}] ${t.title}`);

console.log(lines.join('\n'));
