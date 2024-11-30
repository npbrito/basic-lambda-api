import express, {NextFunction, Request, Response} from "express";
import { randomUUID } from "node:crypto";

// https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code
import s3Service from './services/s3'
import dynamoService from './services/dynamo'
import { Item } from "./@types/item";

const server  = express();
server.use(express.json());
server.use(express.text());

server.use((req:Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

    if(req.method === 'OPTIONS'){
      return res.status(200).end();
    }

  next();
  });

server.post('/files', async (req:Request, res: Response) => {
  const { name, type } = req.body;

  const item: Item = {
    id: randomUUID(),
    s3Path: `/${name}`,
    type: type,
    date: new Date().toString()
  }
  
  const dynamoDB = new dynamoService();
  await dynamoDB.createItem(item);

  res.send('success').status(200);
})

server.post('/presigned-url', async (req:Request, res: Response) => {
  const { name, type } = req.body;
  const key = `/${name}`;

  const s3 = new s3Service();
  const response = await s3.createPresignedPost(key, type);
  
  res.send(response).status(200);
})

server.get('/files/:id/download', async (req:Request, res: Response) => {
  const { id } = req.params;

  const dynamoDB = new dynamoService();
  const item = await dynamoDB.getItem(id);

  const s3 = new s3Service();
  const response = await s3.getSignedUrl(item.s3Path);

  res.send(response).status(200);
})

server.get('/files', async (req:Request, res: Response) => {
    const dynamoDB = new dynamoService();
    
    const items = await dynamoDB.listItems();
    const response = items.map((item => ({...item, name: item.s3Path.split('/')[1]})));
    
    res.send(response).status(200);
})

export default server