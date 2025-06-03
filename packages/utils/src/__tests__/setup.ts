// Global test setup
import { TextEncoder, TextDecoder } from "util";

// Polyfill for crypto.subtle in Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Mock crypto.subtle for tests
Object.defineProperty(global, "crypto", {
  value: {
    subtle: {
      digest: jest.fn().mockImplementation(() => 
        Promise.resolve(new ArrayBuffer(32))
      ),
    },
  },
});

// Mock localStorage for tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
}); 