// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import * as cdk from "@aws-cdk/core";
import  * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as logs from '@aws-cdk/aws-logs';
import * as role from '@aws-cdk/aws-iam';




export class PipelineStack extends cdk.Stack {
  

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    
//   const repository = new codecommit.Repository(this, 'MyRepository', {
//   repositoryName: 'MyRepository',
// });

// const repository = codecommit.Repository.fromRepositoryName(
//       this
//       "EkycSourceRepo",
//       "MyRepository"
//     );,

const sourceOutput = new codepipeline.Artifact();
const sourceAction = new codepipeline_actions.GitHubSourceAction({
              actionName: 'Checkout',
              output: sourceOutput,
              owner: "mmangalg",
              repo: "custom-workshop",
              oauthToken: cdk.SecretValue.plainText("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"),
              branch: 'master',
              trigger: codepipeline_actions.GitHubTrigger.NONE
              
});

// const sourceAction = new codepipeline_actions.CodeCommitSourceAction({
//   actionName: 'CodeCommit',
//   repository,
//   output: sourceOutput,
//   PollForSourceChanges: false
// });

const role1 =  role.Role.fromRoleArn(this, 'imported-role',"arn:aws:iam::996302627310:role/service-role/codebuild-test-project-service-role", {mutable: false},);

const project = new codebuild.PipelineProject(this, 'MyProject', {
   timeout: cdk.Duration.minutes(90),
   logging: {
    cloudWatch: {
      logGroup: new logs.LogGroup(this, `MyLogGroup`, {
         logGroupName: "mint-migration-codebuild-logs"
      }),
      
    },
    
  },
  //  buildSpec: "Buildspec/buildspec1.yaml",
    projectName: "mint-migration-codebuild-project",
    role: role1,
    description: "mint-migration-codebuild-project",
   //encryptionKey: ""



});

const buildAction = new codepipeline_actions.CodeBuildAction({
  actionName: 'CodeBuild',
  project,
  input: sourceOutput,
  outputs: [new codepipeline.Artifact()], // optional
  executeBatchBuild: true, // optional, defaults to false
  combineBatchBuildArtifacts: true, // optional, defaults to false
});

const role2 =  role.Role.fromRoleArn(this, 'imported-role1',"arn:aws:iam::996302627310:role/service-role/AWSCodePipelineServiceRole-us-west-2-poc-project", {mutable: false},)

new codepipeline.Pipeline(this, 'MyPipeline', {
  //role: role2,
  crossAccountKeys: false,
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'Build',
      actions: [buildAction],
    },
  ],
});




    
    

       
    
  }
}
