module.exports = {
    default: {
        parallel: 2, // Requirement 4: Parallelizable execution
        format: [
            'html:cucumber-report.html', // Requirement 5: Human-readable report
            'json:results/results.json', // Requirement 5: CI artifacts
            'summary',
            'progress-bar'
        ],
        paths: ['features/**/*.feature'],
        requireModule: ['ts-node/register'],
        require: ['tests/steps/**/*.ts', 'tests/hooks/**/*.ts'],
        worldParameters: {
            baseUrl: 'https://www.originenergy.com.au'
        }
    }
}