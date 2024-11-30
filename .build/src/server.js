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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_crypto_1 = require("node:crypto");
// https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code
const s3_1 = __importDefault(require("./services/s3"));
const dynamo_1 = __importDefault(require("./services/dynamo"));
const server = (0, express_1.default)();
server.use(express_1.default.json());
server.use(express_1.default.text());
server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});
server.post('/files', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, type } = req.body;
    const item = {
        id: (0, node_crypto_1.randomUUID)(),
        s3Path: `/${name}`,
        type: type,
        date: new Date().toString()
    };
    const dynamoDB = new dynamo_1.default();
    yield dynamoDB.createItem(item);
    res.send('success').status(200);
}));
server.post('/presigned-url', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, type } = req.body;
    const key = `/${name}`;
    const s3 = new s3_1.default();
    const response = yield s3.createPresignedPost(key, type);
    res.send(response).status(200);
}));
server.get('/files/:id/download', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const dynamoDB = new dynamo_1.default();
    const item = yield dynamoDB.getItem(id);
    const s3 = new s3_1.default();
    const response = yield s3.getSignedUrl(item.s3Path);
    res.send(response).status(200);
}));
server.get('/files', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dynamoDB = new dynamo_1.default();
    const items = yield dynamoDB.listItems();
    const response = items.map((item => (Object.assign(Object.assign({}, item), { name: item.s3Path.split('/')[1] }))));
    res.send(response).status(200);
}));
exports.default = server;
//# sourceMappingURL=server.js.map