require('../init')
const { viaHandler, viaHttp } = require('../invokers')
const { TEST_MODE } = process.env
const { testRoomsPreCreated } = require('../manageTestData')
console.log = jest.fn()

describe(`When invoking the GET /room/{position}/exits endpoint`, () => {
  test(`A valid position of an existing room should return exits for the room (1)`, async () => {
    // Arrange
    const testRoom = testRoomsPreCreated[1]
    const position = testRoom.id
    // Act
    const response = await invokeGetRoomExits(position)
    // Assert
    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveLength(1)
    expect(response.body).toContain('NORTH')
  })

  test(`A valid position of an existing room should return exits for the room (2)`, async () => {
    // Arrange
    const testRoom = testRoomsPreCreated[3]
    const position = testRoom.id
    // Act
    const response = await invokeGetRoomExits(position)
    // Assert
    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveLength(6)
    expect(response.body).toContain('NORTH')
    expect(response.body).toContain('SOUTH')
    expect(response.body).toContain('EAST')
    expect(response.body).toContain('WEST')
    expect(response.body).toContain('UP')
    expect(response.body).toContain('DOWN')
  })

  test(`A valid position of a non-existing room should return 404`, async () => {
    // Arrange
    const position = '(11111,22222,33333)'
    // Act
    const response = await invokeGetRoomExits(position)
    // Assert
    expect(response.statusCode).toEqual(404)
  })

  test(`An invalid position should return 400`, async () => {
    // Arrange
    const position = '(11111,22222,c)'
    // Act
    const response = await invokeGetRoomExits(position)
    // Assert
    expect(response.statusCode).toEqual(400)
  })
})

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
