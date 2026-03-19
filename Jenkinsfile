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
                // Ensure any old rerun file is deleted so we don't run old failures
                sh 'rm -f reports/rerun.txt'
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
                    sh 'npm run test:test || true'
                }
            }
        }

        stage('Rerun Failures') {
             // Only run this stage if the rerun file actually contains failed tests
             when {
                expression {
                   return filePathExists('reports/rerun.txt') && readFile('reports/rerun.txt').trim() != ""
                }
             }
             steps {
                echo "Failures detected. Attempting to rerun failed scenarios..."
                // Use the retry script we defined in your package.json
                sh 'npm run test:retry || true'
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

            // Clean up the rerun file so the next build starts fresh
            sh 'rm -f reports/rerun.txt'
        }
    }
}