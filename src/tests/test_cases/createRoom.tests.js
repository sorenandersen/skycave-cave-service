require('../init')
const { viaHandler, viaHttp } = require('../invokers')
const { TEST_MODE } = process.env
const { testRoomsCreatedByTests } = require('../manageTestData')
console.log = jest.fn()

// Test happy path
// *************************************************
describe(`When invoking the POST /room endpoint, with a valid room record`, () => {
  test(`It should create a room`, async () => {
    // Arrange
    const testRoom = testRoomsCreatedByTests[0]
    const position = testRoom.id
    // Act
    const response = await invokeCreateRoom(position, testRoom)
    // Assert
    expect(response.statusCode).toEqual(201)
  })
})

// Test with invalid or missing data
// *************************************************
describe(`When invoking the POST /room endpoint, with invalid data`, () => {
  test(`Invalid position format should not create, but return 400 (1)`, async () => {
    // Arrange
    const position = null
    const testRoom = testRoomsCreatedByTests[0]
    // Act
    const response = await invokeCreateRoom(position, testRoom)
    // Assert
    expect(response.statusCode).toEqual(400)
  })

  test(`Invalid position format should not create, but return 400 (2)`, async () => {
    // Arrange
    const position = ''
    const testRoom = testRoomsCreatedByTests[0]
    // Act
    const response = await invokeCreateRoom(position, testRoom)
    // Assert
    expect(response.statusCode).toEqual(400)
  })

  test(`Invalid position format should not create, but return 400 (3)`, async () => {
    // Arrange
    const position = '(0,0,)'
    const testRoom = testRoomsCreatedByTests[0]
    // Act
    const response = await invokeCreateRoom(position, testRoom)
    // Assert
    expect(response.statusCode).toEqual(400)
  })

  test(`Missing required field 'creatorId' should not create, but return 400`, async () => {
    // Arrange
    const testRoom = testRoomsCreatedByTests[0]
    const position = testRoom.id
    const invalidRoom = {
      description: `New room created by test`,
    }
    // Act
    const response = await invokeCreateRoom(position, invalidRoom)
    // Assert
    expect(response.statusCode).toEqual(400)
  })

  test(`Missing required field 'description' should not create, but return 400`, async () => {
    // Arrange
    const testRoom = testRoomsCreatedByTests[0]
    const position = testRoom.id
    const invalidRoom = {
      creatorId: '100',
    }
    // Act
    const response = await invokeCreateRoom(position, invalidRoom)
    // Assert
    expect(response.statusCode).toEqual(400)
  })
})

// Test with duplicate position
// *************************************************
describe(`When invoking the POST /room endpoint, for a room position that already exists`, () => {
  test(`It should return 409`, async () => {
    // Arrange: Attempt to create the same room as done previously in tests (see statusCode 201)
    const testRoom = testRoomsCreatedByTests[0]
    const position = testRoom.id
    // Act
    const response = await invokeCreateRoom(position, testRoom)
    // Assert
    expect(response.statusCode).toEqual(409)
  })
})

// Helper function that invokes the POST room function handler programatically (integration test) or via HTTP (acceptance/e2e test)
const invokeCreateRoom = async (position, room) => {
  const body = JSON.stringify(room)
  switch (TEST_MODE) {
    case 'handler':
      const event = { pathParameters: { position }, body }
      return await viaHandler('createRoom', event)
    case 'http':
      return await viaHttp('POST', `/room/${position}`, { body })
    default:
      throw new Error(`Unsupported mode: ${mode}`)
  }
}
