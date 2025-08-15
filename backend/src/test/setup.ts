import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

// Test setup
beforeAll(async () => {
  console.log('🧪 Setting up test environment...');
});

afterAll(async () => {
  console.log('🧪 Cleaning up test environment...');
});

beforeEach(async () => {
  // Setup before each test
});

afterEach(async () => {
  // Cleanup after each test
});

// Mock console in tests to reduce noise
global.console = {
  ...console,
  log: () => {}, // Mock console.log in tests
  debug: () => {},
  info: () => {},
};
