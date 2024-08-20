import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocument,
  QueryCommand,
  QueryCommandInput
} from '@aws-sdk/lib-dynamodb'
import { createLogger } from '../../utils/logger'
import AWSXRay from 'aws-xray-sdk-core'

const logger = createLogger('getTodos')

const dynamoDbClient = AWSXRay.captureAWSv3Client(new DynamoDB({}) as any)
const dynamoDb = DynamoDBDocument.from(dynamoDbClient)

const { TODOS_TABLE = '' } = process.env

async function getTodos(userId: string) {
  const params: QueryCommandInput = {
    TableName: TODOS_TABLE,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }

  const result = await dynamoDb.send(new QueryCommand(params))

  logger.info('TODO items retrieved from DynamoDB', {
    userId,
    items: result.Items
  })

  return result.Items || []
}

async function mainHandler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const userId = getUserId(event)

  if (!userId) {
    logger.error('Invalid request: No userId found')
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid request: No userId found'
      })
    }
  }

  const todos = await getTodos(userId)

  logger.info('Returning TODO items', { userId, count: todos.length })

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: todos
    })
  }
}

export const handler = middy(mainHandler)
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
