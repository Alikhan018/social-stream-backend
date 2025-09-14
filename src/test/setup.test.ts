// Global test setup
import { jest } from '@jest/globals';

// Increase timeout for database operations
jest.setTimeout(30000);

// Mock console methods to reduce noise during testing
global.console = {
    ...console,
    // Uncomment to silence logs during testing
    // log: jest.fn(),
    // error: jest.fn(),
    // warn: jest.fn(),
    // info: jest.fn(),
};