require('../steps/init')
const when = require('../steps/when')
console.log = jest.fn()

describe(`When invoking the GET /room/{position}/exits endpoint`, () => {
  it(`Should return exits for the room`, async () => {
    const position = '(0,0,0)'
    const response = await when.invoking_get_room_exits(position)
    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveLength(2)
    expect(response.body).toContain('NORTH')
    expect(response.body).toContain('WEST')
  })
})
