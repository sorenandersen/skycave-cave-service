require('../init')
const { viaHandler, viaHttp } = require('../invokers')
const { TEST_MODE } = process.env
const { testRoomsPreCreated } = require('../manageTestData')
console.log = jest.fn()

const validPosition = '(0,0,0)'
const validRoom = {
  description: 'Updated room description',
  creatorId: '0',
}

// Test happy path
// *************************************************
describe.skip(`When invoking the PUT /room endpoint, with a valid room record`, () => {
  test(`Room should be successfully updated`, async () => {
    // Arrange
    const testRoom = testRoomsPreCreated[0]
    const position = testRoom.id
    const updatedRoom = {
      creatorId: testRoom.creatorId,
      description: 'Updated room description',
    }
    // Act
    const response = await invokeUpdateRoom(position, updatedRoom)
    // Assert
    expect(response.statusCode).toEqual(204)
  })
})

// Test with invalid or missing data
// *************************************************
describe.skip(`When invoking the PUT /room endpoint, with invalid data`, () => {
  test(`Invalid position format should not update, but return 400 (1)`, async () => {
    // Arrange
    const position = null
    const testRoom = testRoomsPreCreated[0]
    // Act
    const response = await invokeUpdateRoom(position, testRoom)
    // Assert
    expect(response.statusCode).toEqual(400)
  })

  test(`Invalid position format should not update, but return 400 (2)`, async () => {
    // Arrange
    const position = ''
    const testRoom = testRoomsPreCreated[0]
    // Act
    const response = await invokeUpdateRoom(position, testRoom)
    // Assert
    expect(response.statusCode).toEqual(400)
  })

  test(`Invalid position format should not update, but return 400 (3)`, async () => {
    // Arrange
    const position = '(0,0,)'
    const testRoom = testRoomsPreCreated[0]
    // Act
    const response = await invokeUpdateRoom(position, testRoom)
    // Assert
    expect(response.statusCode).toEqual(400)
  })

  test(`Missing required field 'creatorId' should not update, but return 400`, async () => {
    // Arrange
    const testRoom = testRoomsPreCreated[0]
    const position = testRoom.id
    const invalidRoom = {
      description: 'Updated room description',
    }
    // Act
    const response = await invokeUpdateRoom(position, invalidRoom)
    // Assert
    expect(response.statusCode).toEqual(400)
  })

  test(`Missing required field 'description' should not update, but return 400`, async () => {
    // Arrange
    const testRoom = testRoomsPreCreated[0]
    const position = testRoom.id
    const invalidRoom = {
      creatorId: '100',
    }
    // Act
    const response = await invokeUpdateRoom(position, invalidRoom)
    // Assert
    expect(response.statusCode).toEqual(400)
  })
})

// Test with invalid room creator
// *************************************************
describe.skip(`When invoking the PUT /room endpoint, for a room created by somebody else`, () => {
  test(`It should not update the room, but return 403`, async () => {
    // Arrange
    const testRoom = testRoomsPreCreated[0]
    const position = testRoom.id
    const updatedRoom = {
      creatorId: '4324231423412',
      description: 'Updated room description',
    }
    // Act
    const response = await invokeUpdateRoom(position, updatedRoom)
    // Assert
    expect(response.statusCode).toEqual(403)
  })
})

// Test with non-existing position
// *************************************************
describe.skip(`When invoking the PUT /room endpoint, for a room position that does not exist`, () => {
  test(`It should return 404`, async () => {
    // Arrange
    const testRoom = testRoomsPreCreated[0]
    const position = '(4324231423412,4324231423412,4324231423412)'
    const updatedRoom = {
      creatorId: testRoom.creatorId,
      description: 'Updated room description',
    }
    // Act
    const response = await invokeUpdateRoom(position, updatedRoom)
    // Assert
    expect(response.statusCode).toEqual(404)
  })
})

// Helper function that invokes the PUT room function handler programatically (integration test) or via HTTP (acceptance/e2e test)
const invokeUpdateRoom = async (position, room) => {
  const body = JSON.stringify(room)
  switch (TEST_MODE) {
    case 'handler':
      const event = { pathParameters: { position }, body }
      return await viaHandler('updateRoom', event)
    case 'http':
      return await viaHttp('PUT', `/room/${position}`, { body })
    default:
      throw new Error(`Unsupported mode: ${mode}`)
  }
}
