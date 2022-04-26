// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import * as cdk from "@aws-cdk/core";
import * as glue from "@aws-cdk/aws-glue";
import { Asset } from "@aws-cdk/aws-s3-assets";
import {
  Role,
  ManagedPolicy,
  ServicePrincipal,
  Policy,
  PolicyStatement,
  Effect,
} from "@aws-cdk/aws-iam";

import * as path from "path";
import * as lambda from "@aws-cdk/aws-lambda";
import * as stepfunctions from  "@aws-cdk/aws-stepfunctions";
import * as s3 from "@aws-cdk/aws-s3"

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

        const glue_db = new glue.Database(this, "glue-workflow-db", {
         databaseName: "glue-workflow-db-pipeline",
    });
    
            const glue_job_asset = new glue.CfnJob(this, "glue-job-asset", {
      name: "transaction-load-decrypt-job-pipeline",
      description: "Copy CDK assets to scripts folder and give meaningful name",
      role: 'arn:aws:iam::996302627310:role/service-role/AWSGlueServiceRole-test-glue-crawler',
      executionProperty: {
        maxConcurrentRuns: 1,
      },
      command: {
        name: "glueetl",
        pythonVersion: "3",
        scriptLocation: "s3://mint-migration-scripts/glue-artifacts/glue-job-name/transaction-load-decrypt-job.scala",
      },
      defaultArguments: {
        "--job-language":"scala",
        "--class": "GlueApp",
        "--shard-identifier": "shard1",
        "--source_db": "mint-migration-stage-decrypted-db",
        "--targetLocation": "s3://mint-migration-raw-encrypted/shard-1/schema_name.table-1"
      },
      maxRetries: 2,
      timeout: 60,
      numberOfWorkers: 10,
      glueVersion: "3.0",
      workerType: "G.1X",
    });

    const fn = new lambda.Function(this, 'MyFunction', {
  runtime:  lambda.Runtime.PYTHON_3_6,
  handler: 'index.lambda_handler',
  code: lambda.Code.fromAsset('Asset'),
  functionName: "MyFunctionPipeline"
});

const fn1 = new lambda.Function(this, 'MyFunction-test', {
  runtime:  lambda.Runtime.PYTHON_3_6,
  handler: 'test.lambda_func',
  code: lambda.Code.fromAsset('Asset'),
  functionName: "MyFunctionTestPipeline"
});
    
  }
}
