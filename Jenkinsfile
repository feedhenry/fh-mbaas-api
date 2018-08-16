#!groovy

// https://github.com/feedhenry/fh-pipeline-library
@Library('fh-pipeline-library') _

node('nodejs6') {

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
