require('../init')
const { viaHandler, viaHttp } = require('../invokers')
const { TEST_MODE } = process.env
const { testRoomsGetRoom } = require('../manageTestData')
console.log = jest.fn()

describe(`When invoking the GET /room endpoint`, () => {
  test(`A valid position of an existing room should return the room`, async () => {
    // Arrange
    const testRoom = testRoomsGetRoom[0]
    const position = testRoom.id
    // Act
    const response = await invokeGetRoom(position)
    // Assert
    expect(response.statusCode).toEqual(200)
    expect(response.body.id).toEqual(testRoom.id)
    expect(response.body.creationTimeISO8601).toEqual(
      testRoom.creationTimeISO8601,
    )
    expect(response.body.creatorId).toEqual(testRoom.creatorId)
    expect(response.body.description).toEqual(testRoom.description)
  })

  test(`A valid position of a non-existing room should return 404`, async () => {
    // Arrange
    const position = '(11111,22222,33333)'
    // Act
    const response = await invokeGetRoom(position)
    // Assert
    expect(response.statusCode).toEqual(404)
  })

  test(`An invalid position should return 400`, async () => {
    // Arrange
    const position = '(11111,22222,c)'
    // Act
    const response = await invokeGetRoom(position)
    // Assert
    expect(response.statusCode).toEqual(400)
  })
})

// Helper function that invokes the GET room function handler programatically (integration test) or via HTTP (acceptance/e2e test)
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
