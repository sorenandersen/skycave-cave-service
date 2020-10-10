const AWS = require('aws-sdk')
AWS.config.region = 'us-east-1'
const dynamodb = new AWS.DynamoDB.DocumentClient()
require('dotenv').config()

const testRoomsCreateRoom = [
  // POST room tests
  {
    id: '(1111,1111,1111)',
    creatorId: '100',
    description: `Room created by test`,
  },
]

const testRoomsUpdateRoom = [
  // PUT room tests
  {
    id: '(1111,1111,2222)',
    creationTimeISO8601: '2020-10-10T17:08:13.38Z',
    creatorId: '100',
    description: `Room created by test`,
  },
]

const testRoomsGetRoom = [
  // GET room tests
  {
    id: '(1111,1111,3333)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test`,
  },
]

const testRoomsGetRoomExits = [
  // GET room exits tests
  {
    id: '(2000,2000,1000)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test, with no adjacent rooms`,
  },
  {
    id: '(2000,2000,2000)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test, with a single adjacent room (NORTH)`,
  },
  {
    id: '(2000,2001,2000)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test`,
  },
  {
    id: '(2000,2000,3000)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test, with six ajacent rooms (NORTH, SOUTH, EAST, WEST, UP, DOWN)`,
  },
  {
    id: '(2000,2001,3000)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test`,
  },
  {
    id: '(2000,1999,3000)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test`,
  },
  {
    id: '(2001,2000,3000)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test`,
  },
  {
    id: '(1999,2000,3000)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test`,
  },
  {
    id: '(2000,2000,3001)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test`,
  },
  {
    id: '(2000,2000,2999)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test`,
  },
]

const requestItems = (requests) => ({
  RequestItems: {
    [process.env.TABLE_NAME]: requests,
  },
})

const insertTestData = async () => {
  const testRooms = []
    .concat(testRoomsUpdateRoom)
    .concat(testRoomsGetRoom)
    .concat(testRoomsGetRoomExits)

  const putRequests = testRooms.map((x) => ({
    PutRequest: {
      Item: x,
    },
  }))

  try {
    await dynamodb.batchWrite(requestItems(putRequests)).promise()
    console.log('Test data successfully deployed.')
  } catch (error) {
    console.error(error)
  }
}

const deleteTestData = async () => {
  const testRooms = []
    .concat(testRoomsCreateRoom)
    .concat(testRoomsUpdateRoom)
    .concat(testRoomsGetRoom)
    .concat(testRoomsGetRoomExits)

  const deleteRequests = testRooms.map((x) => ({
    DeleteRequest: {
      Key: { id: x.id },
    },
  }))

  try {
    await dynamodb.batchWrite(requestItems(deleteRequests)).promise()
    console.log('Test data successfully deleted.')
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  testRoomsCreateRoom,
  testRoomsUpdateRoom,
  testRoomsGetRoom,
  testRoomsGetRoomExits,
  insertTestData,
  deleteTestData,
}
