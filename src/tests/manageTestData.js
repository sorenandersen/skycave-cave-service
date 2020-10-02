const AWS = require('aws-sdk')
const { forOwn } = require('lodash')
AWS.config.region = 'us-east-1'
const dynamodb = new AWS.DynamoDB.DocumentClient()
require('dotenv').config()

const rooms = [
  {
    id: '(100,100,100)',
    creationTimeISO8601: new Date().toISOString(),
    creatorId: 100,
    description: 'TEST record',
  },
]

const requestItems = (requests) => ({
  RequestItems: {
    [process.env.TABLE_NAME]: requests,
  },
})

const insertTestData = () => {
  const putRequests = rooms.map((x) => ({
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
  insertTestData,
  deleteTestData,
}
