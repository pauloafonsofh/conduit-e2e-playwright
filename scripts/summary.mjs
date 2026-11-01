// Reads the Playwright JSON report and prints a Markdown summary for the CI job page:
// smoke cases from TestRail, infra tests, mutants caught, known bugs still present, flaky tests.
// Only the projects present in the report get a row (each CI job runs one project).
// With --badges <dir>, it also writes shields.io endpoint files (smoke.json, mutants.json,
// known-bugs.json), so the README badges show the numbers of the last CI run.
// Usage: node scripts/summary.mjs [results.json] [--badges <dir>]   (default: test-results/results.json)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const badgesAt = args.indexOf('--badges');
const badgesDir = badgesAt >= 0 ? args.splice(badgesAt, 2)[1] : undefined;
const path = args[0] ?? 'test-results/results.json';
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

const rows = [
  ['Smoke cases (TestRail)', smoke, 'passed'],
  ['Infra tests', infra, 'passed'],
  ['Mutants', mutants, 'caught by an assertion'],
  ['Known-bug tests (bug still present)', knownBugs, ''],
].filter(([, items]) => items.length > 0);

const lines = [
  '## E2E summary',
  '',
  '| Check | Result |',
  '|---|---|',
  ...rows.map(([label, items, word]) => `| ${label} | ${items.filter(ok).length}/${items.length}${word ? ` ${word}` : ''} |`),
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

if (badgesDir) {
  const badge = (label, message, good) => ({ schemaVersion: 1, label, message, color: good ? 'brightgreen' : 'red' });
  const files = {
    'smoke.json': badge('smoke', `${smoke.filter(ok).length}/${smoke.length} passed`, smoke.length > 0 && smoke.every(ok)),
    'mutants.json': badge('mutants', `${mutants.filter(ok).length}/${mutants.length} caught`, mutants.length > 0 && mutants.every(ok)),
    'known-bugs.json': {
      schemaVersion: 1,
      label: 'known bugs',
      // One bug can have several tests (issue #3 has two): count distinct issues, not tests.
      message: `${new Set(knownBugs.filter(ok).map(issueOf).filter(Boolean)).size} open`,
      color: knownBugs.every(ok) ? 'orange' : 'blue',
    },
  };
  mkdirSync(badgesDir, { recursive: true });
  for (const [name, content] of Object.entries(files)) writeFileSync(join(badgesDir, name), JSON.stringify(content));
}
