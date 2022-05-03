# # set default region 
# export AWS_DEFAULT_REGION=$3

# # create source bucket if it doesn't exist
# aws s3api create-bucket --bucket $4 --create-bucket-configuration LocationConstraint=$3
# if [ $? -ne 0 ]
# then
#     echo "Bucket already exists choose a different name"
#     exit 1;
# fi

# # upload code and models to source bucket
# aws s3 cp --recursive /home/ec2-user/ekyc/ s3://$4/ekyc/

# # create code commit repository upload source
# aws codecommit create-repository --repository-name "ekyc-deployment-prod" --repository-description "Source code for ekyc solution"
# cd /home/ec2-user/ekyc-deployment
# rm -rf .git
# git init
# git checkout -b main
# touch .gitignore && echo "node_modules/" >> .gitignore
# git add *
# git commit -m "Initial commit"
# git remote add origin codecommit::ap-south-1://ekyc-deployment-prod
# git push -u origin main
# git checkout -b dev
# git push -u origin dev

# # install dependencies, bootstrap environemnt and deploy pipelines
# cd /home/ec2-user/ekyc-deployment
# npm install
# npx cdk bootstrap --cloudformation-execution-policies $1 --bootstrap-kms-key-id AWS_MANAGED_KEY aws://$2/$3
# npx cdk deploy EkycPipelineStack --require-approval never

npm install
npm bootstrap

cdk deploy S3bucketStack --require-approval never
api to upload Glue script to s3 bucket
cdk deploy ResourceStack --require-approval never
cdk deploy PipelineStack --require-approval never