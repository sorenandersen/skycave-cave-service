const DocumentClient = require('aws-sdk/clients/dynamodb').DocumentClient
const dynamodb = new DocumentClient()
const Log = require('@dazn/lambda-powertools-logger')
const { isValidPositionFormat } = require('../lib/validators')

// Responses:
// 200 Room sucessfully retrieved
// 400 Invalid request
// 404 Room not found

const handler = async (event, context) => {
  const position = event.pathParameters.position

  // Validate position
  if (!isValidPositionFormat(position)) {
    return {
      statusCode: 400,
    }
  }

  // Get room
  const room = await getRoomById(position)
  if (!room) {
    return {
      statusCode: 404,
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(room),
  }
}

// Make the "get room" a utility function to be used both here, and before updating a room.
const getRoomById = async (id) => {
  try {
    const result = await dynamodb
      .get({
        TableName: process.env.TABLE_NAME,
        Key: { id },
      })
      .promise()

    return result.Item
  } catch (error) {
    Log.error('dynamodb.get', { Key: { id } }, error)
    throw error
  }
}

module.exports = {
  handler,
  getRoomById,
}
