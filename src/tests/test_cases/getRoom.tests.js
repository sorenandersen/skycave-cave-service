require('../init')
const { viaHandler, viaHttp } = require('../invokers')
const { TEST_MODE } = process.env
console.log = jest.fn()

describe(`When invoking the GET /room endpoint`, () => {
  it(`Should return a room`, async () => {
    const position = '(0,0,0)'
    const response = await invokeGetRoom(position)
    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty('id')
  })
})

// TODO more tests

const invokeGetRoom = async (position) => {
  switch (TEST_MODE) {
    case 'handler':
      const event = { pathParameters: { position } }
      return await viaHandler('getRoom', event)
    case 'http':
      return await viaHttp('GET', `/room/${position}`)
    default:
      throw new Error(`Unsupported mode: ${mode}`)
  }
}
