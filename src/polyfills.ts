
// This file contains polyfills required for the Stellar SDK to work in browser environments

// Buffer polyfill for browser environment
import { Buffer as BufferPolyfill } from 'buffer';

// Make Buffer available globally
window.Buffer = window.Buffer || BufferPolyfill;

// Process polyfill for browser
if (typeof window.process === 'undefined') {
  window.process = { env: {} } as any;
}

// Needed for some crypto libraries that might be used by Stellar SDK
window.global = window as any;
