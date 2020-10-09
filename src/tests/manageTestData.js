const AWS = require('aws-sdk')
AWS.config.region = 'us-east-1'
const dynamodb = new AWS.DynamoDB.DocumentClient()
require('dotenv').config()

const testRoomsPreCreated = [
  // GET and PUT room tests
  {
    id: '(1111,1111,1111)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test`,
  },

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

const testRoomsCreatedByTests = [
  // POST tests
  {
    id: '(1111,1111,2222)',
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
  const putRequests = testRoomsPreCreated.map((x) => ({
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
  const rooms = testRoomsPreCreated.concat(testRoomsCreatedByTests)
  const deleteRequests = rooms.map((x) => ({
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
  testRoomsPreCreated,
  testRoomsCreatedByTests,
  insertTestData,
  deleteTestData,
}
