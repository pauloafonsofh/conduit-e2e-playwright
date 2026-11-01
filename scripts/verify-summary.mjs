// Checks scripts/summary.mjs against a sample report that covers every outcome
// (failed smoke case, surviving mutant, mutant not caught by an assertion, fixed known bug, flaky test).
// Exit 0 when the output matches scripts/fixtures/results-sample.expected.md, 1 otherwise.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const actual = execFileSync('node', ['scripts/summary.mjs', 'scripts/fixtures/results-sample.json'], { encoding: 'utf8' });
const expected = readFileSync('scripts/fixtures/results-sample.expected.md', 'utf8');
const normalize = text => text.replace(/\r\n/g, '\n').trimEnd();

if (normalize(actual) !== normalize(expected)) {
  console.error('summary.mjs output differs from scripts/fixtures/results-sample.expected.md:\n');
  console.error(actual);
  process.exit(1);
}
console.log('Summary OK');
