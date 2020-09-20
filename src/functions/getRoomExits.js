const Log = require('@dazn/lambda-powertools-logger')

const handler = async (event, context) => {
  const position = event.pathParameters.position

  Log.debug('handler_getRoomExits', { position })

  // TODO validate position

  // TODO responses
  // 200 Exits
  // 400 Invalid request
  // 404 Room not found

  const mockRoomExits = ['NORTH', 'WEST']

  return {
    statusCode: 200,
    body: JSON.stringify(mockRoomExits),
  }
}

module.exports.handler = handler
