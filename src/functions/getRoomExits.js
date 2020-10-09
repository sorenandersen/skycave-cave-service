const DocumentClient = require('aws-sdk/clients/dynamodb').DocumentClient
const dynamodb = new DocumentClient()
const Log = require('@dazn/lambda-powertools-logger')
const { isValidPositionFormat } = require('../lib/validators')
const { getRoomById } = require('./getRoom')

// Responses
// 200 Exits sucessfully retrieved
// 400 Invalid request
// 404 Room not found

const handler = async (event, context) => {
  const position = event.pathParameters.position

  // Validate position
  if (!isValidPositionFormat(position)) {
    return {
      statusCode: 400,
    }
  }
  // Validate that room exists
  const existingRoom = await getRoomById(position)
  if (!existingRoom) {
    return {
      statusCode: 404,
    }
  }

  let exits = []

  // Get position as x,y,z
  const [x, y, z] = position.slice(1, -1).split(',')
  // Construct adjacent positions (positions +/- 1 on each dimension) to be tested for existence
  const adjacentPositions = {
    north: { id: `(${x},${y - -1},${z})` },
    south: { id: `(${x},${y - 1},${z})` },
    east: { id: `(${x - -1},${y},${z})` },
    west: { id: `(${x - 1},${y},${z})` },
    up: { id: `(${x},${y},${z - -1})` },
    down: { id: `(${x},${y},${z - 1})` },
  }
  // Get array form of ajacent positoins, to be used for batch querying DynamoDB
  const adjacentPositionsArray = Object.values(adjacentPositions)

  try {
    // Batch query DynamoDB for the six adjacent positions
    const result = await dynamodb
      .batchGet({
        RequestItems: {
          [process.env.TABLE_NAME]: {
            Keys: adjacentPositionsArray,
          },
        },
      })
      .promise()

    // Get all adacent room id's (by mapping returned DynamoDB responses)
    const adjacentRoomIds = result.Responses[
      Object.keys(result.Responses)[0]
    ].map((room) => room.id)
    // Test if adjacent positions exist in the result set.
    // Testing for each possible direction is a little cumbersome (we could just
    // iterate the result set) but this is an easy way to ensure that returned
    // exits are sorted as desired: North, south, east, west, up, down.
    if (adjacentRoomIds.includes(adjacentPositions.north.id))
      exits.push('NORTH')
    if (adjacentRoomIds.includes(adjacentPositions.south.id))
      exits.push('SOUTH')
    if (adjacentRoomIds.includes(adjacentPositions.east.id)) exits.push('EAST')
    if (adjacentRoomIds.includes(adjacentPositions.west.id)) exits.push('WEST')
    if (adjacentRoomIds.includes(adjacentPositions.up.id)) exits.push('UP')
    if (adjacentRoomIds.includes(adjacentPositions.down.id)) exits.push('DOWN')

    return {
      statusCode: 200,
      body: JSON.stringify(exits),
    }
  } catch (error) {
    Log.error('dynamodb.batchGet', { Keys: adjacentPositionsArray }, error)
    throw error
  }
}

module.exports.handler = handler
