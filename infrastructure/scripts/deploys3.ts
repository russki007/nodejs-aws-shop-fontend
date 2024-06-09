// This script is used to update origin S3 bucket with the latest version of the website.
import fs from 'fs-extra';

import path from 'path';
import dotenv from 'dotenv';

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";

async function uploadFile(s3: S3Client, bucket: string, filePath: string, key: string) {
    const fileStream = fs.createReadStream(filePath);

    function getType(ext: string): string {
        switch (ext) {
            case '.html':
                return 'text/html';
            case '.css':
                return 'text/css';
            case '.js':
                return 'text/javascript';
            default:
                return 'application/octet-stream';
        }
    }

    const contentType = getType(path.extname(filePath));

    console.log(`Uploading file: ${filePath} to s3://${bucket}/${key} with Content-Type: ${contentType}`);

    const upload = new Upload({
        client: s3,
        params: {
            Bucket: bucket,
            Key: key,
            Body: fileStream,
            ContentType: contentType,
        },
    });

    await upload.done();
    console.log(`Uploaded ${filePath} to s3://${bucket}/${key}`);
}


async function uploadDirectory(s3: S3Client, bucket: string, dir: string, rootDir?: boolean) {

    if (!path.isAbsolute(dir)) {
        dir = path.resolve(dir);
    }
    console.log(`Uplading source directory: ${dir}`);

    const files = await fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const fileStat = await fs.promises.stat(filePath);

        if (fileStat.isDirectory()) {
            await uploadDirectory(s3, bucket, filePath);
        } else {
            const key = rootDir ? path.basename(file) : `${path.basename(dir)}/${path.basename(file)}`;
            await uploadFile(s3, bucket, filePath, key);
        }
    }
}



async function invalidateCloudFront(cloudFrontClient: CloudFrontClient, distributionId: string, paths: string[]) {
    const command = new CreateInvalidationCommand({
        DistributionId: distributionId,
        InvalidationBatch: {
            Paths: {
                Quantity: paths.length,
                Items: paths,
            },
            CallerReference: `${Date.now()}`,
        },
    });

    try {
        const response = await cloudFrontClient.send(command);
        console.log("Invalidation created:", response.Invalidation?.Id);
    } catch (error) {
        console.error("Error creating invalidation:", error);
    }
}


function getArgValue(argNames: string[], defaultValue: string = ''): string {

    for (let i = 0; i < argNames.length; i++) {
        const argName = argNames[i];
        const index = process.argv.indexOf(`--${argName}`);
        if (index > -1) {
            return process.argv[index + 1];
        }
    }

    return defaultValue;
}

(async () => {

    try {
        dotenv.config();

        const region = process.env.AWS_REGION;
        const bucket = process.env.FILES_BUCKET;
        const distributionId = process.env.DISTRIBUTION_ID || '';

        if (!region || !bucket) {
            throw new Error('Please provide the region and bucket to upload the website in the .env file');
        }

        let directory = getArgValue(['directory', 'd']);
        if (!directory) {
            throw new Error('Please provide the source directory to upload');
        }
        else {
            if (!path.isAbsolute(directory)) {
                directory = path.resolve(directory);
            }
        }

        let invlidate:boolean = Boolean(getArgValue(['invalidate', 'i']));

        console.log(`Uploading to bucket: ${bucket} in region: ${region} from directory: '${directory}'`);
        const s3 = new S3Client({ region: region });
        await uploadDirectory(s3, bucket, directory, true);


        if (invlidate) {
            if (!distributionId) {
                throw new Error('Please provide the CloudFront distribution ID to invalidate the cache');
            }

            console.log(`Invalidating CloudFront distribution ${distributionId}`);
            const cloudFrontClient = new CloudFrontClient({
                region: region, // Replace with your CloudFront distribution's region
            });

            await invalidateCloudFront(cloudFrontClient, distributionId, ['/*']);
        }


        console.log(`Website deployed to s3://${bucket} successfully.`);

    }
    catch (error) {
        console.log(`Error while deploying website to s3: ${error}`);
        process.exit(1);
    }
            
})();