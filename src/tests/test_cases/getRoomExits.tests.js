require('../init')
const { viaHandler, viaHttp } = require('../invokers')
const { TEST_MODE } = process.env
console.log = jest.fn()

describe.skip(`When invoking the GET /room/{position}/exits endpoint`, () => {
  it(`Should return exits for the room`, async () => {
    const position = '(0,0,0)'
    const response = await invokeGetRoomExits(position)
    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveLength(2)
    expect(response.body).toContain('NORTH')
    expect(response.body).toContain('WEST')
  })
})

// TODO more tests

const invokeGetRoomExits = async (position) => {
  switch (TEST_MODE) {
    case 'handler':
      const event = { pathParameters: { position } }
      return await viaHandler('getRoomExits', event)
    case 'http':
      return await viaHttp('GET', `/room/${position}/exits`)
    default:
      throw new Error(`Unsupported mode: ${mode}`)
  }
}
