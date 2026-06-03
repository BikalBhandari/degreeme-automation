const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config({ path: `.env.${process.env.ENV || 'nonprod'}` });

module.exports = defineConfig({
  testDir: './src',
  testMatch: '**/*.spec.js',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html'], ['list']],
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
