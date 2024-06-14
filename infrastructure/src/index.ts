import { CfnOutput, RemovalPolicy, Stack, StackProps, Tag } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BlockPublicAccess, Bucket, BucketEncryption, ObjectOwnership } from 'aws-cdk-lib/aws-s3';
import { AssetsStorage } from './s3';
import { Frontend } from './frontend';

export default class FullstackWebappStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const assetsStorage = new AssetsStorage(this, 'AssetsStorage');
    const frontend = new Frontend(this, 'Frontend', {
      assetsBucket: assetsStorage.websiteBucket,
      deployAtBuildTime: true,
      baseDirectory: '../.',  // Path to sources. Ideally should move to the fronend folder
    });

    new CfnOutput(this, 'DistributionId', { value: `${frontend.cloudFrontWebDistribution.distributionId}` });
    new CfnOutput(this, 'WebsiteUrl', { value: `https://${frontend.cloudFrontWebDistribution.distributionDomainName}` });
    new CfnOutput(this, "FilesBucket", { value: assetsStorage.websiteBucket.bucketName });
    new CfnOutput(this, "Region", { value: this.region });
    new CfnOutput(this, "StackName", { value: this.stackName });
  }
}