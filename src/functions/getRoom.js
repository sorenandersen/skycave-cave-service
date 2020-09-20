const Log = require('@dazn/lambda-powertools-logger')

const handler = async (event, context) => {
  const position = event.pathParameters.position

  // TODO validate position

  Log.debug('handler_getRooms', { position })

  const mockRoom = {
    id: position,
    creationTimeISO8601: '2020-04-13T15:04:43.084+02:00',
    description:
      'You are standing at the end of a road before a small brick building.',
    creatorId: '0',
  }

  return {
    statusCode: 200,
    body: JSON.stringify(mockRoom),
  }
}

module.exports.handler = handler
