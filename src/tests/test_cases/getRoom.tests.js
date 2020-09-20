require('../steps/init')
const when = require('../steps/when')
console.log = jest.fn()

describe(`When invoking the GET /room endpoint`, () => {
  it(`Should return a room`, async () => {
    const position = '(0,0,0)'
    const response = await when.invoking_get_room(position)
    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty('id')
  })
})
