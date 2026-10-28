// smokeCase declares one TestRail smoke case once and generates:
// - the normal test, tagged @smoke;
// - one test per mutant, tagged @mutant, that injects the mutant's defect and must be
//   caught by an assertion. A mutant that survives (test still green) or that only breaks
//   the flow in another way (timeout, navigation error) makes the mutant test fail.
import type {
  Page,
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
} from '@playwright/test';
import { test, type Fixtures } from './fixtures';
import type { Mutant } from './network-faults';

export type CaseArgs = PlaywrightTestArgs & PlaywrightTestOptions & PlaywrightWorkerArgs & PlaywrightWorkerOptions & Fixtures;
export type CaseBody = (args: CaseArgs) => Promise<void>;

function isAssertionError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'matcherResult' in error;
}

export function smokeCase(id: string, title: string, opts: { mutants: Mutant[] }, body: CaseBody): void {
  if (opts.mutants.length === 0) {
    throw new Error(`${id}: a smoke case needs at least one mutant`);
  }
  const name = `${id} – ${title}`;

  test(name, { tag: '@smoke' }, body);

  for (const mutant of opts.mutants) {
    const runMutant = async (args: CaseArgs) => {
      const page: Page = args.page ?? args.authedPage;
      await mutant.install(page);
      try {
        await body(args);
      } catch (error) {
        if (isAssertionError(error)) {
          test.info().annotations.push({ type: 'caught-by', description: String((error as Error).message).split('\n')[0] });
          return;
        }
        throw new Error(`Mutant ${mutant.id} not caught by an assertion: ${(error as Error).message}`);
      }
      throw new Error(`Mutant ${mutant.id} survived: the test did not detect the injected defect (${mutant.description})`);
    };
    // Playwright reads the fixture names from the function source, so the wrapper
    // must expose the same parameter list as the case body.
    runMutant.toString = () => body.toString();
    test(`${name} [mutant: ${mutant.id}]`, { tag: '@mutant' }, runMutant);
  }
}
