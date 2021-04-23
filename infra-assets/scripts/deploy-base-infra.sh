#!/bin/bash
STACK_NAME="${app_prefix}-${stage}-base-infra"
RED='\033[0;31m'
NC='\033[0m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'
db_user='db_user'
db_pass='testpass'
BACK_SRC_URL="https://github.com/indrapranesh/keepitclean-backend-nodejs.git"

function fail(){
    echo -e "${RED}Failure: $* ${NC}"
    exit 1
}

function info() {
    echo -e "${BLUE} $* ${NC}"
}

function success() {
    echo -e "${GREEN} $* ${NC}"
}

function navigate_to_correct_directory() {
    cd "${0%/*}" # Directory where script lives
    cd ../
}

function navigate_to_serverless_directory() {
    cd ../
}

function check_jq() {
    info "checking if jq is installed..."
    
    if ! [ -x "$(command -v jq)" ]; then
        fail "jq is not installed."
        info "installing jq"
        apt update -y
        apt install jq -y
    fi
    
    success "jq is installed"
}

function deploy_serverless() {
    info "deploying serverless for stack ${STACK_NAME}..."
    navigate_to_serverless_directory
    sls deploy --stage ${stage} --region ${region} --stackPrefix ${app_prefix} --db_user ${db_user} --db_pass ${db_pass} --vpc_stack ${vpc_stack}
    success "Successfully deployed serverless stack"
    sls migrations up --stage ${stage} --region ${region} --stackPrefix ${app_prefix} --db_user ${db_user} --db_pass ${db_pass} --vpc_stack ${vpc_stack}
}

deploy_base_infra() {
    info "deploying stack ${STACK_NAME}..."

    if [ ${stage} == "dev" ]; then
        ip_range="102."
        elif [ ${stage} == "qa" ]; then
        ip_range="192."
        elif [ ${stage} == "prod" ]; then
        ip_range="172."
    fi
    info "ip range ${ip_range}"

    aws cloudformation deploy --region ${region} --capabilities CAPABILITY_NAMED_IAM --template-file ./templates/base-infra.yml --stack-name $STACK_NAME \
    --parameter-overrides stage=${stage} stackPrefix=${app_prefix} MasterUsername=${db_user} MasterUserPassword=${db_pass} backendSrcUrl=${BACK_SRC_URL} \
    IpRange=${ip_range} BastionKeyName="${app_prefix}-${stage}"

    success "Successfully deployed base stack"

}
navigate_to_correct_directory
#check_jq
deploy_base_infra

if [[ $run_sls == 'true' ]];
then
    deploy_serverless
fi
