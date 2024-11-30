"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_presigned_post_1 = require("@aws-sdk/s3-presigned-post");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
// ENVS
const { ENVIRONMENT, AWS_ACCESS_KEY_ID, AWS_ACCESS_SECRET, AWS_ACCOUNT_REGION, S3_NAME_PRIVATE_FILES } = process.env;
class S3Service {
    constructor() {
        this.s3 = this.connect();
    }
    connect() {
        if (ENVIRONMENT === 'production') {
            return new client_s3_1.S3({});
        }
        return new client_s3_1.S3({
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_ACCESS_SECRET
            },
            region: AWS_ACCOUNT_REGION
        });
    }
    getSignedUrl(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: S3_NAME_PRIVATE_FILES,
                Key: key,
                ResponseContentDisposition: `attachment; filename = ${key.split('/')[1]}`
            });
            return yield (0, s3_request_presigner_1.getSignedUrl)(this.s3, command, { expiresIn: 30 });
        });
    }
    createPresignedPost(key, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, fields } = yield (0, s3_presigned_post_1.createPresignedPost)(this.s3, {
                Bucket: S3_NAME_PRIVATE_FILES,
                Key: key,
                Fields: {
                    key: key,
                    'Content-Type': type
                },
                Expires: 900
            });
            return { url, fields };
        });
    }
}
exports.default = S3Service;
//# sourceMappingURL=s3.js.map