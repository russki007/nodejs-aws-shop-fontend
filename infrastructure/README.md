# Search SPA in AWS
This is a blank project for CDK deployment for [RS - AWS Clould Developer](https://github.com/rolling-scopes-school/aws/tree/main/aws-developer/02_serving_spa).


- [Website URL](https://dgtp5jga6qb5w.cloudfront.net)
- [S3](https://websitebucket-984942.s3.ap-southeast-2.amazonaws.com/)

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [Deploy infrastructure](#deploy-infrastructure)
  - [Clean up](#clean-up)

## Prerequisites
 To set up this notes app, complete the following tasks:

- Install **Node.js** by following these steps:
  1. Install [nvm](https://github.com/nvm-sh/nvm#installation-and-update).
  1. Use node v18.x.x by running `nvm use` or `nvm use 18.12.1` in a terminal window.
- Install dependencies by running `npm`.
- If you don't have an AWS account, [create one](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/).
- Install the [AWS CLI](https://aws.amazon.com/cli/).
- Set up [AWS Shared Credential File](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).
  - Your `~/.aws/credentials` (`%UserProfile%\.aws\credentials` on Windows) should look like the following:
    ```
    [default]
    aws_access_key_id = <ACCESS_KEY>
    aws_secret_access_key = <SECRET_ACCESS_KEY>
    ```
  - Your `~/.aws/config` (`%UserProfile%\.aws\config` on Windows) should look like the following:
    ```
    [default]
    region = us-west-2
    ``` 

## Setup

### Deploy infrastructure
From the root of this directory.

- Run: `npm run deploy`
- This command:
  - Creates AWS infrastructure using [AWS Cloud Development Kit](https://aws.amazon.com/cdk/).
  - Creates resources to be used in the frontend, specifally S3 bucket and CloudFront.

### Deploy Files to S2

- Run: `npm deply:s3`
- This command copies website files from the `dist` diretory to the AWS S2
- This command creates invalidation

### Clean up

The Cloudformation stack can be deleted by running: `npx cdk destroy`