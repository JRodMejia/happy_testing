import { vi } from 'vitest';

/**
 * Mock Next.js router
 */
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
};

/**
 * Reset router mock
 */
export const resetRouterMock = () => {
  mockRouter.push.mockClear();
  mockRouter.replace.mockClear();
  mockRouter.prefetch.mockClear();
  mockRouter.back.mockClear();
  mockRouter.forward.mockClear();
  mockRouter.refresh.mockClear();
};

/**
 * Setup router mock for specific test
 */
export const setupRouterMock = (overrides = {}) => {
  return {
    ...mockRouter,
    ...overrides,
  };
};

// Export mock for vi.mock
export const createRouterMock = () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockRouter.pathname,
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
});
