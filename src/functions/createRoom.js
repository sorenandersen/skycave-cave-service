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

  //Log.debug('handler_createRoom', { position, room })

  // Validate position
  if (!isValidPositionFormat(position)) {
    return {
      statusCode: 400,
    }
  }
  // Validate room
  if (!room.description || !room.creatorId) {
    return {
      statusCode: 400,
    }
  }

  try {
    await dynamodb
      .put({
        TableName: process.env.TABLE_NAME,
        Item: {
          id: position,
          description: room.description,
          creatorId: room.creatorId,
          creationTimeISO8601: new Date().toISOString(),
        },
      })
      .promise()

    // // TODO finish ConditionExpression
    // await dynamodb
    //   .put({
    //     TableName: process.env.TABLE_NAME,
    //     Item: {
    //       id: position,
    //       description: room.description,
    //       creatorId: room.creatorId,
    //       creationTimeISO8601: new Date().toISOString(),
    //     },
    //     ConditionExpression: 'attribute_not_exists(id)'
    //   })
    //   .promise()
  } catch (error) {
    // TODO
    // On duplicate position, return status code 409:
    // 409 Room already exists
  }

  return {
    statusCode: 201,
  }
}

module.exports.handler = handler
