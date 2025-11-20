import { defineConfig } from '@playwright/test';

/**
 * Playwright configuration for API testing
 * Separate from E2E tests for better organization
 */
export default defineConfig({
  testDir: '../tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['list'],
    ['html', { 
      outputFolder: 'api-test-results/html-report', 
      open: 'never' 
    }],
    ['json', { 
      outputFile: 'api-test-results/results.json' 
    }],
  ],

  use: {
    baseURL: 'http://localhost:3000',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
    trace: 'on-first-retry',
  },

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
