import { Construct } from 'constructs';
import { RemovalPolicy, Stack } from 'aws-cdk-lib';
import { BlockPublicAccess, Bucket, BucketEncryption, IBucket } from 'aws-cdk-lib/aws-s3';
import { CloudFrontWebDistribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';

export interface FrontendProps {
  readonly accessLogBucket?: IBucket;
  readonly assetsBucket: IBucket;
  readonly baseDirectory: string;
  readonly deployAtBuildTime?: boolean;
}

export class Frontend extends Construct {
  readonly cloudFrontWebDistribution: CloudFrontWebDistribution;
  constructor(scope: Construct, id: string, props: FrontendProps) {
    super(scope, id);


    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');

    const distribution = new CloudFrontWebDistribution(this, 'Distribution', {
      // define origin for our distribution
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: props.assetsBucket,
            originAccessIdentity,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
            },
          ],
        },
      ],
      errorConfigurations: [
        {
          errorCode: 404,
          errorCachingMinTtl: 0,
          responseCode: 200,
          responsePagePath: '/',
        },
        {
          errorCode: 403,
          errorCachingMinTtl: 0,
          responseCode: 200,
          responsePagePath: '/',
        },
      ],
      loggingConfig: props.accessLogBucket ? {
        bucket: props.accessLogBucket,
        prefix: 'frontend/',
      } : undefined,
    });

    this.cloudFrontWebDistribution = distribution;

    props.assetsBucket.grantRead(originAccessIdentity);
  }
}