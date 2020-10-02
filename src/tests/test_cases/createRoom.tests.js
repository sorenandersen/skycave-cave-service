require('../init')
const chance = require('chance').Chance()
const { viaHandler, viaHttp } = require('../invokers')
const { TEST_MODE } = process.env
console.log = jest.fn()

generateRandomPosition = () => {
  const chanceIntegerOptions = { min: -999, max: 999 }
  const x = chance.integer(chanceIntegerOptions)
  const y = chance.integer(chanceIntegerOptions)
  const z = chance.integer(chanceIntegerOptions)
  return `(${x},${y},${z})`
}

const validRoom = {
  description: `New room crated by test`,
  creatorId: '0',
}

describe.skip(`When invoking the POST /room endpoint, with a valid room record`, () => {
  test(`It should create a room`, async () => {
    const response = await invokeCreateRoom(generateRandomPosition(), validRoom)
    expect(response.statusCode).toEqual(201)
  })
})

describe.skip(`When invoking the POST /room endpoint, with invalid data`, () => {
  // TODO

  test(`Invalid position format should not create, but return 400 (1)`, async () => {
    const position = null
    const response = await invokeCreateRoom(position, validRoom)
    expect(response.statusCode).toEqual(400)
  })

  test(`Invalid position format should not create, but return 400 (2)`, async () => {
    const position = ''
    const response = await invokeCreateRoom(position, validRoom)
    expect(response.statusCode).toEqual(400)
  })

  test(`Invalid position format should not create, but return 400 (3)`, async () => {
    const position = '(0,0,)'
    const response = await invokeCreateRoom(position, validRoom)
    expect(response.statusCode).toEqual(400)
  })

  test(`Missing required field 'description' should not create, but return 400`, async () => {
    const invalidRoom = {
      creatorId: '0',
    }
    const response = await invokeCreateRoom(
      generateRandomPosition(),
      invalidRoom,
    )
    expect(response.statusCode).toEqual(400)
  })

  test(`Missing required field 'creatorId' should not create, but return 400`, async () => {
    const invalidRoom = {
      description: 'Room description',
    }
    const response = await invokeCreateRoom(
      generateRandomPosition(),
      invalidRoom,
    )
    expect(response.statusCode).toEqual(400)
  })
})

describe.skip(`When invoking the POST /room endpoint, for a room position that already exists`, () => {
  test(`It should return 409`, async () => {
    const position = '(0,0,0)'
    const response = await invokeCreateRoom(position, validRoom)
    expect(response.statusCode).toEqual(409)
  })
})

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
