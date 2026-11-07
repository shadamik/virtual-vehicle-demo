const { defineConfig } = require('@playwright/test');

// Set BASE_URL to test a deployment instead of starting the local server.
const targetURL = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/+$/, '') + '/' : undefined;
module.exports = defineConfig({
  testDir: './tests',
  workers: 1,
  forbidOnly: !!process.env.CI,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    browserName: 'chromium',
    baseURL: targetURL || 'http://127.0.0.1:4173',
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2, reducedMotion: 'no-preference',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: targetURL ? undefined : {
    command: process.env.TEST_SITE_DIR === 'dist' ? 'npx http-server dist -a 127.0.0.1 -p 4173 -c-1' : 'npm run start',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false
  }
});
