import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Suppress console warnings during tests
const originalConsoleWarn = console.warn
console.warn = (...args) => {
  if (args[0]?.includes?.('React does not recognize')) return
  if (args[0]?.includes?.('Warning: ')) return
  originalConsoleWarn(...args)
}

// Jest setup file for global mocks and environment setup
import '@testing-library/jest-dom';

// Global mocks for Node.js environment
global.ReadableStream = class ReadableStream {
  constructor() {}
};

global.Blob = class Blob {
  constructor(parts, options) {}
};

// Mock File API for Node.js environment
global.File = class File extends Blob {
  constructor(fileBits, fileName, options) {
    super(fileBits, options);
    this.name = fileName;
    this.lastModified = Date.now();
  }
  
  arrayBuffer() {
    return Promise.resolve(new ArrayBuffer(12));
  }
};

// Ensure ArrayBuffer and Uint8Array are available
global.ArrayBuffer = ArrayBuffer;
global.Uint8Array = Uint8Array; 