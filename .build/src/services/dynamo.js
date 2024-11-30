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
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const { ENVIRONMENT, AWS_ACCESS_KEY_ID, AWS_ACCESS_SECRET, AWS_ACCOUNT_REGION, DYNAMO_TABLE_NAME } = process.env;
class DynamoDb {
    constructor() {
        this.dynamoDB = this.connect();
    }
    connect() {
        if (ENVIRONMENT === 'production') {
            return new client_dynamodb_1.DynamoDBClient({});
        }
        return new client_dynamodb_1.DynamoDBClient({
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_ACCESS_SECRET
            },
            region: AWS_ACCOUNT_REGION
        });
    }
    listItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.dynamoDB.send(new lib_dynamodb_1.ScanCommand({
                TableName: DYNAMO_TABLE_NAME
            }));
            return result.Items;
        });
    }
    createItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dynamoDB.send(new lib_dynamodb_1.PutCommand({
                TableName: DYNAMO_TABLE_NAME,
                Item: item
            }));
        });
    }
    getItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.dynamoDB.send(new lib_dynamodb_1.GetCommand({
                TableName: DYNAMO_TABLE_NAME,
                Key: {
                    id: id
                }
            }));
            console.log(result);
            return result.Item;
        });
    }
}
exports.default = DynamoDb;
//# sourceMappingURL=dynamo.js.map