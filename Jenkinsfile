#!/usr/bin/env groovy

node {
    stage('checkout') {
        checkout scm
        sh 'chmod +x mvnw'
    }

    stage('check java') {
        sh "java -version"
    }

    stage('clean') {
        sh "./mvnw -ntp clean -P-webapp"
    }
    stage('nohttp') {
        sh "./mvnw -ntp checkstyle:check"
    }

    stage('backend tests') {
        try {
            sh "./mvnw -ntp verify -P-webapp"
        } catch(err) {
            throw err
        } finally {
            junit '**/target/surefire-reports/TEST-*.xml,**/target/failsafe-reports/TEST-*.xml'
        }
    }

    stage('packaging') {
        sh "./mvnw -ntp verify -P-webapp -Pprod -DskipTests"
        archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
    }

    stage('publish docker') {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh "./mvnw -ntp -Pprod verify jib:build -Djib.to.image=docker.io/tonuser/customer-service:${env.BUILD_NUMBER} -Djib.to.auth.username=$DOCKER_USER -Djib.to.auth.password=$DOCKER_PASS"
        }
    }
}
