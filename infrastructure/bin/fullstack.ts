#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import WebAppStack from "../src";

const app = new cdk.App();

const owner = 'russki007';
const stackName = `${owner}-WebAppStack`;

const stackDescription = 'Stack for deploying a web application with CloudFront';
const project = 'react-shop-cloudfront';
const environment = 'develop';

const webAppStack = new WebAppStack(app, stackName, {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    },
    description: stackDescription
});

cdk.Tags.of(webAppStack).add('environment', environment);
cdk.Tags.of(webAppStack).add('owner', owner);
cdk.Tags.of(webAppStack).add('project', project);