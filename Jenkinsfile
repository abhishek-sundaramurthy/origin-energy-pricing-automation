pipeline {
    agent any

    tools {
        nodejs 'node' // Ensure Node.js is configured in Jenkins Global Tool Configuration
    }

    stages {
        stage('Cleanup') {
            steps {
                // Clean old reports before starting
                sh 'npm run pretest'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                // Ensure Playwright browsers are installed in the Jenkins agent
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Execute Tests') {
            steps {
                // Run your test script (e.g., against the Test environment)
                // We use 'catchError' so the pipeline continues to the report stage even if tests fail
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh 'npm run test:test'
                }
            }
        }
    }

    post {
        always {
            // 1. Process the JUnit XML for the pass/fail trends in Jenkins
            junit 'reports/junit-report.xml'

            // 2. Archive the fancy HTML report so you can view it later
            archiveArtifacts artifacts: 'reports/enhanced-report/**/*', allowEmptyArchive: true

            // 3. Generate the fancy report (running your report.js)
            sh 'node report.js'
        }
    }
}