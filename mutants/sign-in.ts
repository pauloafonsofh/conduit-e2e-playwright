// Candidate mutants for the Sign In area (C1, C46, C69). Each one simulates a plausible
// defect; Paulo picks at least one per case.
import { replyJson, tamperJson, type Mutant } from '../support/network-faults';
import { headerLinkOpens, headerLinkWithoutLabel } from './header-links';

export const signInLinkOpensSignUp: Mutant = {
  id: 'sign-in-link-opens-sign-up',
  description: 'The "Sign in" link in the header opens the Sign up page',
  install: page => headerLinkOpens(page, 'login', 'register'),
};

export const signInLinkWithoutLabel: Mutant = {
  id: 'sign-in-link-without-label',
  description: 'The "Sign in" link in the header has no label, so users cannot find it',
  install: page => headerLinkWithoutLabel(page, 'login'),
};

export const signInReturnsOtherUser: Mutant = {
  id: 'sign-in-returns-other-user',
  description: 'Sign in succeeds but the API returns another user, so the header shows the wrong username',
  install: page => tamperJson(page, '**/api/users/login', body => ({ user: { ...body.user, username: 'pqa-someone-else' } })),
};

export const validCredentialsRejected: Mutant = {
  id: 'valid-credentials-rejected',
  description: 'A valid email and password are rejected as invalid',
  install: page => replyJson(page, '**/api/users/login', 422, { errors: { 'email or password': ['is invalid'] } }),
};
