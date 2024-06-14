
import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { BlockPublicAccess, Bucket, BucketEncryption, ObjectOwnership, IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class AssetsStorage extends Construct {

    public readonly websiteBucket: IBucket;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.websiteBucket = new Bucket(this, 'WebsiteBucket', {
            bucketName : `websitebucket-${getRandomInt(1000000)}`,
            encryption: BucketEncryption.S3_MANAGED,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            enforceSSL: true,
            removalPolicy: RemovalPolicy.DESTROY,
            objectOwnership: ObjectOwnership.OBJECT_WRITER,
            autoDeleteObjects: true,
            websiteIndexDocument: "index.html"
        });
        

        //new CfnOutput(this, "WebsiteBucket", {value: this.websiteBucket.bucketWebsiteUrl});
    }
}  

const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * Math.floor(max));
}