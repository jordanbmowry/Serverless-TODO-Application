import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocument,
  UpdateCommand,
  UpdateCommandInput
} from '@aws-sdk/lib-dynamodb'
import { createLogger } from '../../utils/logger'
import AWSXRay from 'aws-xray-sdk-core'

const logger = createLogger('updateTodo')

const dynamoDbClient = AWSXRay.captureAWSv3Client(new DynamoDB({}) as any)
const dynamoDb = DynamoDBDocument.from(dynamoDbClient)

const { TODOS_TABLE = '' } = process.env

async function updateTodo(
  todoId: string,
  userId: string,
  updatedTodo: { name: string; dueDate: string; done: boolean }
): Promise<void> {
  const params: UpdateCommandInput = {
    TableName: TODOS_TABLE,
    Key: { todoId, userId },
    UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
    ExpressionAttributeNames: { '#name': 'name' },
    ExpressionAttributeValues: {
      ':name': updatedTodo.name,
      ':dueDate': updatedTodo.dueDate,
      ':done': updatedTodo.done
    },
    ReturnValues: 'NONE'
  }

  await dynamoDb.send(new UpdateCommand(params))
  logger.info('TODO item updated in DynamoDB', { userId, todoId, updatedTodo })
}

async function mainHandler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const todoId = event.pathParameters?.todoId
  if (!todoId) {
    logger.error('Invalid request: No todoId provided')
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid request: No todoId provided'
      })
    }
  }

  const userId = event.requestContext.authorizer?.principalId
  if (!userId) {
    logger.error('Invalid request: No userId found')
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid request: No userId found'
      })
    }
  }

  let updatedTodo: { name: string; dueDate: string; done: boolean }

  try {
    updatedTodo = JSON.parse(event.body || '{}')
  } catch (error) {
    logger.error('Invalid request: Malformed JSON', { error })
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid request: Malformed JSON'
      })
    }
  }

  try {
    await updateTodo(todoId, userId, updatedTodo)
    logger.info('TODO item updated successfully', {
      userId,
      todoId,
      updatedTodo
    })
    return {
      statusCode: 204,
      body: ''
    }
  } catch (error) {
    logger.error('Failed to update TODO item', { error, userId, todoId })
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to update TODO item'
      })
    }
  }
}

export const handler = middy(mainHandler)
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
