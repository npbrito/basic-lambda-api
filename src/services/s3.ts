import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// ENVS
const { ENVIRONMENT, AWS_ACCESS_KEY_ID, AWS_ACCESS_SECRET,
    AWS_ACCOUNT_REGION, S3_NAME_PRIVATE_FILES } = process.env

export default class S3Service {
    s3: S3;

    constructor() {
        this.s3 = this.connect();
    }

    connect() {
        if (ENVIRONMENT === 'production') {
            return new S3({});
        }

        return new S3({
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_ACCESS_SECRET
            },
            region: AWS_ACCOUNT_REGION
        });
    }

    async getSignedUrl(key: string) {
        const command = new GetObjectCommand({
            Bucket: S3_NAME_PRIVATE_FILES,
            Key: key,
            ResponseContentDisposition: `attachment; filename = ${key.split('/')[1]}`
        });
        return await getSignedUrl(this.s3, command, { expiresIn: 30 });
    }

    async createPresignedPost(key: string, type: string) {
        const { url, fields } = await createPresignedPost(this.s3, {
            Bucket: S3_NAME_PRIVATE_FILES,
            Key: key,
            Fields: {
                key: key,
                'Content-Type': type
            },
            Expires: 900
        });

        return { url, fields };
    }
}