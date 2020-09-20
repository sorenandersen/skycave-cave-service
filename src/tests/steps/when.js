const { viaHandler, viaHttp } = require('./util')

// Toggle between "invoke function locally" (mode === 'handler') and "call the deployed API" (mode === 'http')
const { TEST_MODE } = process.env

const invoking_get_room = async (position) => {
  switch (TEST_MODE) {
    case 'handler':
      const event = { pathParameters: { position } }
      return await viaHandler('getRoom', event)
    case 'http':
      return await viaHttp('GET', '/room/(0,0,0)')
    default:
      throw new Error(`Unsupported mode: ${mode}`)
  }
}

const invoking_get_room_exits = async (position) => {
  switch (TEST_MODE) {
    case 'handler':
      const event = { pathParameters: { position } }
      return await viaHandler('getRoomExits', event)
    case 'http':
      return await viaHttp('GET', '/room/(0,0,0)/exits')
    default:
      throw new Error(`Unsupported mode: ${mode}`)
  }
}

const invoking_create_room = async (position, room) => {
  // TODO
}

const invoking_update_room = async (position, room) => {
  // TODO
}

module.exports = {
  invoking_get_room,
  invoking_get_room_exits,
  invoking_create_room,
  invoking_update_room,
}
