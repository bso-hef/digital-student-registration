import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * MSW worker for browser/jsdom test environment
 * This worker intercepts HTTP requests during unit tests
 */
export const worker = setupWorker(...handlers);
