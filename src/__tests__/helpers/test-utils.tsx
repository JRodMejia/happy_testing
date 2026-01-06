import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Custom render function that wraps components with common providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options });
}

/**
 * Setup user event for user interactions
 */
export function setupUser() {
  return userEvent.setup();
}

/**
 * Wait for element to be removed from DOM
 */
export async function waitForElementToBeRemoved(
  callback: () => HTMLElement | null,
  options?: { timeout?: number }
) {
  const { waitForElementToBeRemoved: wait } = await import('@testing-library/react');
  return wait(callback, options);
}

/**
 * Common test utilities
 */
export const testUtils = {
  /**
   * Generate unique email for testing
   */
  generateEmail: () => `test${Date.now()}@example.com`,

  /**
   * Generate unique username
   */
  generateUsername: () => `user${Date.now()}`,

  /**
   * Wait for specific milliseconds
   */
  wait: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),

  /**
   * Get form values from form element
   */
  getFormValues: (form: HTMLFormElement) => {
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
  },
};

/**
 * Mock localStorage
 */
export const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

/**
 * Custom matchers for better assertions
 */
export const customMatchers = {
  toHaveBeenCalledWithMatch: (received: any, expected: any) => {
    const calls = received.mock.calls;
    const match = calls.some((call: any[]) =>
      JSON.stringify(call).includes(JSON.stringify(expected))
    );

    return {
      pass: match,
      message: () =>
        match
          ? `Expected mock not to be called with ${JSON.stringify(expected)}`
          : `Expected mock to be called with ${JSON.stringify(expected)}`,
    };
  },
};

// Re-export commonly used testing library functions
export { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
