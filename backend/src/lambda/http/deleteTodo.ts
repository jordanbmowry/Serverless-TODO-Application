import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocument,
  DeleteCommand,
  DeleteCommandInput,
  GetCommand,
  GetCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import AWSXRay from 'aws-xray-sdk-core';
import { createLogger } from '../../utils/logger';

const logger = createLogger('deleteTodo');

const dynamoDbClient = AWSXRay.captureAWSv3Client(new DynamoDB() as any);
const dynamoDb = DynamoDBDocument.from(dynamoDbClient);

const s3Client = AWSXRay.captureAWSv3Client(new S3Client({}) as any);

const { TODOS_TABLE = '', IMAGES_S3_BUCKET = '' } = process.env;

async function deleteImageFromS3(attachmentUrl: string) {
  const attachmentKey = attachmentUrl.split('/').pop();

  if (attachmentKey) {
    const deleteParams = {
      Bucket: IMAGES_S3_BUCKET,
      Key: attachmentKey,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));
    logger.info('Deleted image from S3', { attachmentKey });
  }
}

async function deleteTodo(todoId: string, userId: string): Promise<void> {
  // Fetch the todo item to get the attachment URL
  const getParams: GetCommandInput = {
    TableName: TODOS_TABLE,
    Key: { todoId, userId },
  };

  const todoItem = await dynamoDb.send(new GetCommand(getParams));

  if (todoItem.Item?.attachmentUrl) {
    await deleteImageFromS3(todoItem.Item.attachmentUrl);
  }

  const deleteParams: DeleteCommandInput = {
    TableName: TODOS_TABLE,
    Key: { todoId, userId },
  };

  await dynamoDb.send(new DeleteCommand(deleteParams));
  logger.info('TODO item deleted from DynamoDB', { userId, todoId });
}

async function mainHandler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const todoId = event.pathParameters?.todoId;

  if (!todoId) {
    logger.error('Invalid request: No todoId provided');
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid request: No todoId provided',
      }),
    };
  }

  const userId = event.requestContext.authorizer?.principalId;
  if (!userId) {
    logger.error('Invalid request: No userId found');
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid request: No userId found',
      }),
    };
  }

  try {
    await deleteTodo(todoId, userId);
    logger.info('TODO item deleted successfully', { userId, todoId });
    return {
      statusCode: 204,
      body: '',
    };
  } catch (error) {
    logger.error('Failed to delete TODO item', { error, userId, todoId });
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to delete TODO item',
      }),
    };
  }
}

export const handler = middy(mainHandler)
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
    })
  );
