const { defineConfig, devices } = require('@playwright/test');
const siteTestPort = process.env.SITE_TEST_PORT || '4173';
const siteBaseURL = `http://127.0.0.1:${siteTestPort}`;

module.exports = defineConfig({
    testDir: './tests/responsive',
    timeout: 45_000,
    fullyParallel: true,
    reporter: [
        ['list'],
        ['html', { open: 'never' }]
    ],
    use: {
        baseURL: siteBaseURL,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
    },
    webServer: {
        command: 'npm start',
        url: `${siteBaseURL}/api/health`,
        env: { PORT: siteTestPort },
        reuseExistingServer: true,
        timeout: 120_000
    },
    projects: [
        {
            name: 'desktop-wide',
            use: {
                browserName: 'chromium',
                ...devices['Desktop Chrome'],
                viewport: { width: 1440, height: 900 }
            }
        },
        {
            name: 'desktop-narrow-980',
            use: {
                browserName: 'chromium',
                ...devices['Desktop Chrome'],
                viewport: { width: 980, height: 740 }
            }
        },
        {
            name: 'tablet-ipad',
            use: {
                browserName: 'chromium',
                ...devices['iPad Pro 11']
            }
        },
        {
            name: 'phone-iphone-13',
            use: {
                browserName: 'chromium',
                ...devices['iPhone 13']
            }
        },
        {
            name: 'phone-landscape',
            use: {
                browserName: 'chromium',
                ...devices['iPhone 13 landscape']
            }
        }
    ]
});
