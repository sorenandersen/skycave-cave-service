const Log = require('@dazn/lambda-powertools-logger')

const handler = async (event, context) => {
  const position = event.pathParameters.position
  const room = JSON.parse(event.body)
  //const { creationTimeISO8601, description, creatorId } = room

  Log.debug('handler_createRoom', { position, room })

  // TODO validate position
  // TODO validate room

  // TODO responses
  // 201 Room successfully created
  // 400 Invalid request
  // 409 Room already exists

  return {
    statusCode: 201,
    body: undefined,
  }
}

module.exports.handler = handler
