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

  //Log.debug('handler_getRoom', { position })

  // Validate position
  if (!isValidPositionFormat(position)) {
    return {
      statusCode: 400,
    }
  }

  const result = await dynamodb
    .get({
      TableName: process.env.TABLE_NAME,
      Key: { id: position },
    })
    .promise()

  if (!result.Item) {
    return {
      statusCode: 404,
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
  }
}

module.exports.handler = handler
