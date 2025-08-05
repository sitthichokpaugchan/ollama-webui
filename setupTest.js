import '@testing-library/jest-dom/vitest';

// Mock window.scrollTo to prevent "Not implemented" errors in JSDOM
window.scrollTo = vi.fn();