require('../init')
const { viaHandler, viaHttp } = require('../invokers')
const { TEST_MODE } = process.env
console.log = jest.fn()

const validPosition = '(0,0,0)'
const validRoom = {
  description: 'Updated room description',
  creatorId: '0',
}

describe.skip(`When invoking the PUT /room endpoint, with a valid room record`, () => {
  test(`Room should be successfully updated`, async () => {
    const response = await invokeUpdateRoom(validPosition, validRoom)
    expect(response.statusCode).toEqual(204)
  })
})

describe.skip(`When invoking the PUT /room endpoint, with invalid data`, () => {
  test(`Invalid position format should not update, but return 400 (1)`, async () => {
    const position = null
    const response = await invokeUpdateRoom(position, validRoom)
    expect(response.statusCode).toEqual(400)
  })

  test(`Invalid position format should not update, but return 400 (2)`, async () => {
    const position = ''
    const response = await invokeUpdateRoom(position, validRoom)
    expect(response.statusCode).toEqual(400)
  })

  test(`Invalid position format should not update, but return 400 (3)`, async () => {
    const position = '(0,0,)'
    const response = await invokeUpdateRoom(position, validRoom)
    expect(response.statusCode).toEqual(400)
  })

  test(`Missing required field 'description' should not update, but return 400`, async () => {
    const invalidRoom = {
      creatorId: '0',
    }
    const response = await invokeUpdateRoom(validPosition, invalidRoom)
    expect(response.statusCode).toEqual(400)
  })

  test(`Missing required field 'creatorId' should not update, but return 400`, async () => {
    const invalidRoom = {
      description: 'Updated room description',
    }
    const response = await invokeUpdateRoom(validPosition, invalidRoom)
    expect(response.statusCode).toEqual(400)
  })
})

describe.skip(`When invoking the PUT /room endpoint, for a room created by somebody else`, () => {
  test(`It should not update the room, but return 403`, async () => {
    const room = {
      description: 'Updated room description',
      creatorId: '1',
    }
    const response = await invokeUpdateRoom(validPosition, room)
    expect(response.statusCode).toEqual(403)
  })
})

describe.skip(`When invoking the PUT /room endpoint, for a room position that does not exist`, () => {
  test(`It should return 404`, async () => {
    const position = '(42,42,42)'
    const response = await invokeUpdateRoom(position, validRoom)
    expect(response.statusCode).toEqual(404)
  })
})

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
