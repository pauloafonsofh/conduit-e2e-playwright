// Runs the harness specs and checks that the mutant mechanism behaves as designed:
// a caught mutant passes, a surviving mutant fails, and a mutant that only causes a timeout fails.
// Exit 0 when every outcome matches, 1 otherwise.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const expected = [
  { title: 'H1 – page shows title and subtitle', project: 'smoke', status: 'passed' },
  { title: 'H1 – page shows title and subtitle [mutant: subtitle-changed-in-api]', project: 'mutants', status: 'passed' },
  { title: 'H1 – page shows title and subtitle [mutant: title-changed-in-next-data]', project: 'mutants', status: 'passed' },
  { title: 'H2 – weak test misses an unchecked field', project: 'smoke', status: 'passed' },
  { title: 'H2 – weak test misses an unchecked field [mutant: extra-field-changed]', project: 'mutants', status: 'failed', message: 'survived' },
  { title: 'H3 – action times out under the mutant', project: 'smoke', status: 'passed' },
  { title: 'H3 – action times out under the mutant [mutant: button-removed]', project: 'mutants', status: 'failed', message: 'not caught by an assertion' },
];

spawnSync('npx', ['playwright', 'test', '-c', 'harness/harness.config.ts'], { stdio: 'ignore', shell: true });

const report = JSON.parse(readFileSync('harness/test-results/results.json', 'utf8'));
const actual = new Map();
const walk = suite => {
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests) {
      const last = t.results.at(-1);
      actual.set(`${t.projectName}|${spec.title}`, {
        status: last?.status,
        message: (last?.errors ?? []).map(e => e.message ?? '').join('\n'),
      });
    }
  }
  (suite.suites ?? []).forEach(walk);
};
report.suites.forEach(walk);

let failures = 0;
for (const e of expected) {
  const got = actual.get(`${e.project}|${e.title}`);
  const ok = got && got.status === e.status && (!e.message || got.message.includes(e.message));
  if (!ok) failures++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} [${e.project}] ${e.title} — expected ${e.status}${e.message ? ` ("${e.message}")` : ''}, got ${got ? got.status : 'missing'}`);
}
if (actual.size !== expected.length) {
  failures++;
  console.log(`FAIL expected ${expected.length} harness tests, found ${actual.size}`);
}
console.log(failures === 0 ? 'Harness OK' : `Harness: ${failures} problem(s)`);
process.exit(failures === 0 ? 0 : 1);
