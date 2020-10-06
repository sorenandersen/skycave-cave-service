const DocumentClient = require('aws-sdk/clients/dynamodb').DocumentClient
const dynamodb = new DocumentClient()
const Log = require('@dazn/lambda-powertools-logger')
const { isValidPositionFormat } = require('../lib/validators')
const { getRoomById } = require('./getRoom')

// Responses
// 200 Exits sucessfully retrieved
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
  // Validate that room exists
  const existingRoom = await getRoomById(position)
  if (!existingRoom) {
    return {
      statusCode: 404,
    }
  }

  // TODO implement core logic
  // ..................
  // ..................

  return {
    statusCode: 501,
  }

  // TODO delete ...
  const mockRoomExits = ['NORTH', 'WEST']
  return {
    statusCode: 200,
    body: JSON.stringify(mockRoomExits),
  }
}

module.exports.handler = handler
