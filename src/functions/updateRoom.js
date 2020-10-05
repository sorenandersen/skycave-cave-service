const DocumentClient = require('aws-sdk/clients/dynamodb').DocumentClient
const dynamodb = new DocumentClient()
const Log = require('@dazn/lambda-powertools-logger')
const { isValidPositionFormat } = require('../lib/validators')
const { getRoomById } = require('./getRoom')

// Responses
// 204 Room successfully updated
// 400 Invalid request
// 403 User is not the room creator
// 404 Room not found

const handler = async (event, context) => {
  const position = event.pathParameters.position
  const room = JSON.parse(event.body)

  Log.debug('handler_updateRoom ', { position, room })

  // Validate position
  if (!isValidPositionFormat(position)) {
    return {
      statusCode: 400,
    }
  }
  // Validate room properties
  if (!room.description || !room.creatorId) {
    return {
      statusCode: 400,
    }
  }
  // Validate that room exists
  const existingRoom = await getRoomById(position)
  if (!existingRoom) {
    return {
      statusCode: 404,
    }
  }

  try {
    await dynamodb
      .update({
        TableName: process.env.TABLE_NAME,
        Key: { id: position },
        UpdateExpression: 'SET description = :description',
        ConditionExpression: 'creatorId = :creatorId',
        ExpressionAttributeValues: {
          ':description': room.description,
          ':creatorId': room.creatorId,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise()

    return {
      statusCode: 204,
    }
  } catch (error) {
    // Handle attempt to update room created by someone else
    if (error.code === 'ConditionalCheckFailedException') {
      return {
        statusCode: 403,
      }
    }

    // Generic error
    Log.error('dynamodb.update', { room }, error)
    return {
      statusCode: 500,
    }
  }
}

module.exports.handler = handler
