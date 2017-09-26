#!groovy

// https://github.com/feedhenry/fh-pipeline-library
@Library('fh-pipeline-library') _

fhBuildNode {
    stage('Install Dependencies') {
        npmInstall {}
    }

    stage('Unit Tests') {
        withOpenshiftServices(['mongodb']) {
            sh 'grunt fh:test'
        }
    }
    stage('Build') {
        gruntBuild {
            name = 'fh-mbaas-api'
        }
    }
}
