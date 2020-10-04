require('../init')
const chance = require('chance').Chance()
const { viaHandler, viaHttp } = require('../invokers')
const { TEST_MODE } = process.env
const { testRooms } = require('../manageTestData')
console.log = jest.fn()

// TEMP links usable for testing
// ----------------------
// Jest Setup and Teardown docs: before/after Each/All
// https://jestjs.io/docs/en/setup-teardown
//
// Chance
// Chance is a minimalist generator of random [1] strings, numbers, etc. to help reduce some monotony particularly while writing automated tests or anywhere else you need anything random.
// https://chancejs.com/basics/integer.html

//beforeAll(() => {
// TODO load test data
//})
//afterAll(() => {
// TODO delete test data
//})

generateRandomPosition = () => {
  const chanceIntegerOptions = { min: -999, max: 999 }
  const x = chance.integer(chanceIntegerOptions)
  const y = chance.integer(chanceIntegerOptions)
  const z = chance.integer(chanceIntegerOptions)
  return `(${x},${y},${z})`
}

// Test create happy path
// *************************************************
describe(`When invoking the POST /room endpoint, with a valid room record`, () => {
  test(`It should create a room`, async () => {
    // Arrange
    const testRoom = testRooms[1]
    const position = testRoom.id
    // Act
    const response = await invokeCreateRoom(position, testRoom)
    // Assert
    expect(response.statusCode).toEqual(201)
  })
})

// Test create, with invalid or missing data
// *************************************************
describe(`When invoking the POST /room endpoint, with invalid data`, () => {
  test(`Invalid position format should not create, but return 400 (1)`, async () => {
    // Arrange
    const position = null
    const testRoom = testRooms[1]
    // Act
    const response = await invokeCreateRoom(position, testRoom)
    // Assert
    expect(response.statusCode).toEqual(400)
  })

  test(`Invalid position format should not create, but return 400 (2)`, async () => {
    // Arrange
    const position = ''
    const testRoom = testRooms[1]
    // Act
    const response = await invokeCreateRoom(position, testRoom)
    // Assert
    expect(response.statusCode).toEqual(400)
  })

  test(`Invalid position format should not create, but return 400 (3)`, async () => {
    // Arrange
    const position = '(0,0,)'
    const testRoom = testRooms[1]
    // Act
    const response = await invokeCreateRoom(position, testRoom)
    // Assert
    expect(response.statusCode).toEqual(400)
  })

  test(`Missing required field 'creatorId' should not create, but return 400`, async () => {
    // Arrange
    const testRoom = testRooms[1]
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
    const testRoom = testRooms[1]
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

// Test create, with duplicate position
// *************************************************
describe.skip(`When invoking the POST /room endpoint, for a room position that already exists`, () => {
  // ***
  // TODO
  // ***

  test(`It should return 409`, async () => {
    // Arrange
    const testRoom = testRooms[1]
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
