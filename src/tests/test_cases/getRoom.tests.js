require('../init')
const { viaHandler, viaHttp } = require('../invokers')
const { TEST_MODE } = process.env
console.log = jest.fn()

// TEMP links usable for testing
// ----------------------
// Jest Setup and Teardown docs: before/after Each/All
// https://jestjs.io/docs/en/setup-teardown
//
// Chance
// Chance is a minimalist generator of random [1] strings, numbers, etc. to help reduce some monotony particularly while writing automated tests or anywhere else you need anything random.
// https://chancejs.com/basics/integer.html

beforeAll(() => {
  // TODO load test data
})
afterAll(() => {
  // TODO delete test data
})

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
