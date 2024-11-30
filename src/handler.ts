// @ts-nocheck
import serverless from 'serverless-http'
import server from './server'

export async function run(event: any, context: any){
    const handler = serverless(server);
    return await handler(event, context)
}