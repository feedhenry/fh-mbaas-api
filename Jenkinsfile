#!groovy

// https://github.com/feedhenry/fh-pipeline-library
@Library('fh-pipeline-library') _

//This image has redis-server pre-installed. Do not use the 'nodejs6' one as it doesn't have redis-server.
node('nodejs6-ubuntu') {

    step([$class: 'WsCleanup'])

    stage ('Checkout') {
        checkout scm
    }

    stage('Install Dependencies') {
        npmInstall {}
    }

    stage('Unit tests') {
        sh 'grunt fh-unit'
    }

    stage('Build') {
        gruntBuild {
            name = 'fh-mbaas-api'
        }
    }
}
