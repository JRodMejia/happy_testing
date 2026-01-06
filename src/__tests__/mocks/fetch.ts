import { vi } from 'vitest';

/**
 * Mock fetch API
 */
export const mockFetch = vi.fn();

/**
 * Reset fetch mock
 */
export const resetFetchMock = () => {
  mockFetch.mockReset();
};

/**
 * Setup successful fetch response
 */
export const mockFetchSuccess = (data: any, status = 200) => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
    headers: new Headers(),
  });
};

/**
 * Setup failed fetch response
 */
export const mockFetchError = (error: any, status = 400) => {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => error,
    text: async () => JSON.stringify(error),
    headers: new Headers(),
  });
};

/**
 * Setup fetch rejection (network error)
 */
export const mockFetchReject = (error = 'Network error') => {
  mockFetch.mockRejectedValueOnce(new Error(error));
};

/**
 * Setup fetch with delay
 */
export const mockFetchWithDelay = (data: any, delay = 100) => {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          ok: true,
          status: 200,
          json: async () => data,
        }),
      delay
    )
  );
};

/**
 * Get fetch call count
 */
export const getFetchCallCount = () => mockFetch.mock.calls.length;

/**
 * Get last fetch call arguments
 */
export const getLastFetchCall = () => {
  const calls = mockFetch.mock.calls;
  return calls[calls.length - 1];
};

/**
 * Verify fetch was called with specific arguments
 */
export const expectFetchCalledWith = (url: string, options?: RequestInit) => {
  const calls = mockFetch.mock.calls;
  const matchingCall = calls.find(
    (call) => call[0] === url && (!options || JSON.stringify(call[1]) === JSON.stringify(options))
  );
  
  return {
    toBeCalled: () => !!matchingCall,
    getCall: () => matchingCall,
  };
};
