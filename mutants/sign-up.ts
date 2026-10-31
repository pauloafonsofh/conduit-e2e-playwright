// Candidate mutants for the Sign Up area (C5, C10, C44). Each one simulates a plausible
// defect; Paulo picks at least one per case.
import { replyJson, tamperJson, type Mutant } from '../support/network-faults';
import { headerLinkOpens, headerLinkWithoutLabel } from './header-links';

export const signUpLinkOpensSignIn: Mutant = {
  id: 'sign-up-link-opens-sign-in',
  description: 'The "Sign up" link in the header opens the Sign in page',
  install: page => headerLinkOpens(page, 'register', 'login'),
};

export const signUpLinkWithoutLabel: Mutant = {
  id: 'sign-up-link-without-label',
  description: 'The "Sign up" link in the header has no label, so users cannot find it',
  install: page => headerLinkWithoutLabel(page, 'register'),
};

export const signUpSavesOtherUsername: Mutant = {
  id: 'sign-up-saves-other-username',
  description: 'The account is created with a different username from the one typed',
  install: page => tamperJson(page, '**/api/users', body => ({ user: { ...body.user, username: `${body.user.username}-x` } })),
};

export const newEmailRejectedAsTaken: Mutant = {
  id: 'new-email-rejected-as-taken',
  description: 'A new, unused email is rejected as "already taken"',
  install: page => replyJson(page, '**/api/users', 422, { errors: { email: ['has already been taken'] } }),
};
