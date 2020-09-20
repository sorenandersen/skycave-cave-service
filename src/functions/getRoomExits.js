const Log = require('@dazn/lambda-powertools-logger')

const handler = async (event, context) => {
  const position = event.pathParameters.position

  // TODO validate position

  Log.debug('handler_getRoomExits', { position })

  const mockRoomExits = ['NORTH', 'WEST']

  return {
    statusCode: 200,
    body: JSON.stringify(mockRoomExits),
  }
}

module.exports.handler = handler
