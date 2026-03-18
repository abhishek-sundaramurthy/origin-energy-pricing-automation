const report = require('multiple-cucumber-html-reporter');

report.generate({
    jsonDir: './reports/', // Path to your JSON files
    reportPath: './reports/enhanced-report/', // Where to save the new HTML
    metadata: {
        browser: {
            name: 'chrome',
            version: 'latest'
        },
        device: 'Local Test Machine',
        platform: {
            name: 'osx',
            version: 'latest'
        }
    },
    customData: {
        title: 'Run Info',
        data: [
            { label: 'Project', value: 'Origin Energy Pricing' },
            { label: 'Release', value: '1.0.0' },
            { label: 'Environment', value: 'Test' }
        ]
    }
});