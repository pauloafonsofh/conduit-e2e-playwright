// Stops the whole run early, with one clear message, when the shared Conduit instance is down.
import { request } from '@playwright/test';
import { API_URL } from './support/api';
import { BASE_URL } from './playwright.config';

export default async function globalSetup() {
  const context = await request.newContext();
  let problem: string | undefined;
  try {
    const response = await context.get(`${API_URL}/tags`, { timeout: 15_000 });
    if (!response.ok()) problem = `HTTP ${response.status()}`;
  } catch (error) {
    problem = (error as Error).message.split('\n')[0];
  } finally {
    await context.dispose();
  }
  if (problem) {
    throw new Error(`Conduit at ${BASE_URL} is not reachable (GET /api/tags: ${problem})`);
  }
}
