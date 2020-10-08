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
    id: '(2222,2222,2222)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test`,
  },
  {
    id: '(2222,2223,2222)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test`,
  },
  {
    id: '(3333,3333,3333)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test`,
  },
  {
    id: '(3333,3334,3333)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test`,
  },
  {
    id: '(3333,3332,3333)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test`,
  },
  {
    id: '(3333,3333,3334)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test`,
  },
  {
    id: '(3333,3333,3332)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test`,
  },
  {
    id: '(3334,3333,3333)',
    creationTimeISO8601: '2020-10-02T18:37:30.771Z',
    creatorId: '100',
    description: `Room created by test`,
  },
  {
    id: '(3332,3333,3333)',
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

const insertTestData = () => {
  const putRequests = testRoomsPreCreated.map((x) => ({
    PutRequest: {
      Item: x,
    },
  }))

  dynamodb
    .batchWrite(requestItems(putRequests))
    .promise()
    .then(() => console.log('Test data successfully deployed.'))
    .catch((err) => console.error(err))
}

const deleteTestData = () => {
  const rooms = testRoomsPreCreated.concat(testRoomsCreatedByTests)
  const deleteRequests = rooms.map((x) => ({
    DeleteRequest: {
      Key: { id: x.id },
    },
  }))

  dynamodb
    .batchWrite(requestItems(deleteRequests))
    .promise()
    .then(() => console.log('Test data successfully deleted.'))
    .catch((err) => console.error(err))
}

module.exports = {
  testRoomsPreCreated,
  testRoomsCreatedByTests,
  insertTestData,
  deleteTestData,
}
