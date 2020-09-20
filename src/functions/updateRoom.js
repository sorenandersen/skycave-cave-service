const Log = require('@dazn/lambda-powertools-logger')

const handler = async (event, context) => {
  const position = event.pathParameters.position

  Log.debug('handler_updateRoom ', { position })

  // TODO validate position
  // TODO validate room

  // TODO responses
  // 204 Room successfully updated
  // 400 Invalid request
  // 403 User is not the room creator
  // 404 Room not found

  const mockRoom = {
    id: position,
    creationTimeISO8601: '2020-04-13T15:04:43.084+02:00',
    description:
      'You are standing at the end of a road before a small brick building.',
    creatorId: '0',
  }

  return {
    statusCode: 204,
    body: null,
  }
}

module.exports.handler = handler
