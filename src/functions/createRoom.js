const DocumentClient = require('aws-sdk/clients/dynamodb').DocumentClient
const dynamodb = new DocumentClient()
const Log = require('@dazn/lambda-powertools-logger')
const { isValidPositionFormat } = require('../lib/validators')

// Responses
// 201 Room successfully created
// 400 Invalid request
// 409 Room already exists

const handler = async (event, context) => {
  const position = event.pathParameters.position
  const room = JSON.parse(event.body)

  Log.debug('handler_createRoom', { position, room })

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

  const newRoom = {
    id: position,
    description: room.description,
    creatorId: room.creatorId,
    creationTimeISO8601: new Date().toISOString(),
  }

  try {
    await dynamodb
      .put({
        TableName: process.env.TABLE_NAME,
        Item: newRoom,
        ConditionExpression: 'attribute_not_exists(id)',
      })
      .promise()

    return {
      statusCode: 201,
    }
  } catch (error) {
    // Handle attempt to create room with position that already exists
    if (error.code === 'ConditionalCheckFailedException') {
      return {
        statusCode: 409,
      }
    }

    // Generic error
    Log.error('dynamodb.put', { newRoom }, error)
    return {
      statusCode: 500,
    }
  }
}

module.exports.handler = handler
