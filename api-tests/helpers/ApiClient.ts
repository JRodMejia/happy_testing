/**
 * Base API client for making HTTP requests
 * Provides common utilities for API testing
 */

import { APIRequestContext } from '@playwright/test';

export class ApiClient {
  constructor(public request: APIRequestContext) {}

  /**
   * Makes a POST request to the API
   */
  async post(endpoint: string, data: object) {
    return await this.request.post(endpoint, {
      data,
    });
  }

  /**
   * Makes a GET request to the API
   */
  async get(endpoint: string, headers?: Record<string, string>) {
    return await this.request.get(endpoint, {
      headers,
    });
  }

  /**
   * Makes a PUT request to the API
   */
  async put(endpoint: string, data: object, headers?: Record<string, string>) {
    return await this.request.put(endpoint, {
      data,
      headers,
    });
  }

  /**
   * Makes a DELETE request to the API
   */
  async delete(endpoint: string, headers?: Record<string, string>) {
    return await this.request.delete(endpoint, {
      headers,
    });
  }

  /**
   * Extracts session cookie from response
   */
  extractSessionCookie(response: { headers: () => Record<string, string> }): string | null {
    const cookies = response.headers()['set-cookie'];
    if (!cookies) return null;
    
    const sessionMatch = cookies.match(/session=([^;]+)/);
    return sessionMatch ? sessionMatch[1] : null;
  }

  /**
   * Creates authorization headers with session cookie
   */
  createAuthHeaders(sessionId: string): Record<string, string> {
    return {
      'Cookie': `session=${sessionId}`,
    };
  }
}
