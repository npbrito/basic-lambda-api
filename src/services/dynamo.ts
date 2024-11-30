import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import { Item } from "../@types/item";

const { ENVIRONMENT, AWS_ACCESS_KEY_ID, AWS_ACCESS_SECRET,
    AWS_ACCOUNT_REGION, DYNAMO_TABLE_NAME } = process.env

export default class DynamoDb {
    dynamoDB: DynamoDBClient;

    constructor() {
        this.dynamoDB = this.connect()
    }

    connect() {
        if (ENVIRONMENT === 'production') {
            return new DynamoDBClient({});
        }

        return new DynamoDBClient({
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_ACCESS_SECRET
            },
            region: AWS_ACCOUNT_REGION
        });
    }

    async listItems(): Promise<Item[]> {
        const result = await this.dynamoDB.send(new ScanCommand({
            TableName: DYNAMO_TABLE_NAME
        }));
        return result.Items as Item[];
    }

    async createItem(item: Item): Promise<void>{
        await this.dynamoDB.send(new PutCommand({
            TableName: DYNAMO_TABLE_NAME,
            Item: item
        }));
    }

    async getItem(id: string): Promise<Item>{
       const result = await this.dynamoDB.send(new GetCommand({
            TableName: DYNAMO_TABLE_NAME,
            Key: {
                id: id
            }
        }));
        console.log(result);
        return result.Item as Item
    }
}
