module.exports = {
    default: {
        paths: ['features/**/*.feature'],
        requireModule: ['ts-node/register'],
        require: ['tests/**/*.ts'],
        format: ['html:cucumber-report.html', 'summary'],
        publishQuiet: true
    }
}