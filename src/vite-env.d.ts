
/// <reference types="vite/client" />

// Add global declarations for browser environment
interface Window {
  global: Window;
}

// Declare global Buffer for use with Stellar SDK
declare var Buffer: any;
