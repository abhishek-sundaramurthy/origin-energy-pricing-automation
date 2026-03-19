module.exports = {
    default: {
        paths: ['src/tests/features/**/*.feature'],
        requireModule: ['ts-node/register'],
        require: ['src/tests/**/*.ts'],
        format: [
            "progress-bar", // Keep the console output
            "html:reports/cucumber-report.html", // Standard HTML for humans
            "json:reports/cucumber-report.json", // JSON for CI tools
            "junit:reports/junit-report.xml",    // JUnit for Azure/Jenkins/Jira
            "rerun:reports/rerun.txt"
        ],
        parallel: 2,
        retry: 1,
        publishQuiet: true
    }
}