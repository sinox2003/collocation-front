pipeline {

    environment {
        dockerImageName = "laamirikhadija/coloc-app"
        dockerImage = ""
        DOCKERHUB_CREDENTIALS = credentials('dockerhublogin')
        KUBECONFIG = credentials('kubernetes')
        KUBECONFIG_CREDENTIALS_ID = 'kubernetes'
     }

    agent any
    stages {

        stage('Build image') {
              steps{
                script {
                  dockerImage = docker.build dockerImageName
                }
              }
        }

        stage('Pushing Image') {
              steps {
                    // Utilisation des credentials Docker Hub
                    withCredentials([usernamePassword(credentialsId: 'dockerhublogin',
                                                      usernameVariable: 'DOCKERHUB_CREDENTIALS_USR',
                                                      passwordVariable: 'DOCKERHUB_CREDENTIALS_PSW')]) {

                    echo "Docker Username: ${DOCKERHUB_CREDENTIALS_USR}"
                    writeFile file: 'docker_token.txt', text: "${DOCKERHUB_CREDENTIALS_PSW}"

                    bat """
                         echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin < docker_token.txt
                    """
                    bat """
                        docker push ${dockerImage.imageName()}:latest
                    """
                    }
              }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                     withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIALS_ID, variable: 'KUBECONFIG')]) {
                        bat '''
                            kubectl --kubeconfig=%KUBECONFIG% apply -f deploymentservice.yml --validate=false
                        '''
                    }
                }
            }
        }
    }
}