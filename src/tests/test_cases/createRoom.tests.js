require('../steps/init')
const when = require('../steps/when')
//console.log = jest.fn()

describe(`When invoking the POST /room endpoint`, () => {
  it(`Should create a room`, async () => {
    const position = '(0,0,0)'
    const room = {
      creationTimeISO8601: '2020-04-13T15:04:43.084+02:00',
      description:
        'You are standing at the end of a road before a small brick building.',
      creatorId: '0',
    }
    const response = await when.invoking_create_room(position, room)
    expect(response.statusCode).toEqual(201)
  })
})
