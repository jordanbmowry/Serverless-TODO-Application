import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import AWSXRay from 'aws-xray-sdk-core'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, UpdateCommand } from '@aws-sdk/lib-dynamodb'

const logger = createLogger('generateUploadUrl')

const {
  IMAGES_S3_BUCKET = '',
  SIGNED_URL_EXPIRATION = '300',
  TODOS_TABLE = ''
} = process.env

const s3Client = AWSXRay.captureAWSv3Client(new S3Client({}) as any)
const dynamoDbClient = AWSXRay.captureAWSv3Client(new DynamoDB() as any)
const dynamoDb = DynamoDBDocument.from(dynamoDbClient)

async function generatePresignedUrl(todoId: string): Promise<string> {
  const params: PutObjectCommandInput = {
    Bucket: IMAGES_S3_BUCKET,
    Key: todoId
  }

  const command = new PutObjectCommand(params)

  try {
    const url = await getSignedUrl(s3Client, command, {
      expiresIn: parseInt(SIGNED_URL_EXPIRATION, 10)
    })
    logger.info('Generated presigned URL', { url })
    return url
  } catch (error) {
    logger.error('Error generating presigned URL', { error })
    throw new Error('Could not generate presigned URL')
  }
}

async function saveAttachmentUrl(
  todoId: string,
  userId: string,
  attachmentUrl: string
) {
  const params = {
    TableName: TODOS_TABLE,
    Key: { todoId, userId },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': attachmentUrl
    }
  }

  await dynamoDb.send(new UpdateCommand(params))
  logger.info('Updated TODO item with attachment URL', {
    userId,
    todoId,
    attachmentUrl
  })
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

  try {
    const presignedUrl = await generatePresignedUrl(todoId)
    const attachmentUrl = presignedUrl.split('?')[0]

    await saveAttachmentUrl(todoId, userId, attachmentUrl)

    logger.info('Presigned URL generated and saved successfully', {
      presignedUrl
    })
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: presignedUrl
      })
    }
  } catch (error) {
    logger.error('Failed to generate and save presigned URL', { error })
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to generate upload URL'
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
