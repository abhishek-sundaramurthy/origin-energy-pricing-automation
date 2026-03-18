module.exports = {
    default: {
        paths: ['features/**/*.feature'],
        requireModule: ['ts-node/register'],
        require: ['tests/**/*.ts'],
        format: [
            "progress-bar", // Keep the console output
            "html:reports/cucumber-report.html", // Standard HTML for humans
            "json:reports/cucumber-report.json", // JSON for CI tools
            "junit:reports/junit-report.xml"     // JUnit for Azure/Jenkins/Jira
        ],
        publishQuiet: true
    }
}