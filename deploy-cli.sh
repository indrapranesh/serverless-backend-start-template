#!/bin/bash
export stage=dev
export region=us-east-1
export branchName=dev
export dbPassword=testpass
export app_prefix=keep-it-clean
export need_repo='true'
sudo apt update -y && sudo apt install jq -y
npm i -g serverless
npm i
chmod +x deploy.sh
chmod +x infra-assets/scripts/deploy-base-infra.sh
./deploy.sh