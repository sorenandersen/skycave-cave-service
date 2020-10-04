const getPathValue = require('lodash/get')
const axios = require('axios')
const APP_ROOT = '../'

const viaHandler = async (functionName, event) => {
  const handler = require(`${APP_ROOT}functions/${functionName}`).handler
  const context = {}
  const response = await handler(event, context)
  const contentType = getPathValue(
    response,
    'headers.content-type',
    'application/json',
  )
  if (getPathValue(response, 'body') && contentType === 'application/json') {
    response.body = JSON.parse(response.body)
  }
  return response
}

const viaHttp = async (method, relPath, options) => {
  const url = `${process.env.ROOT_URL}${relPath}`
  console.info(`Invoking via HTTP ${method} ${url}`)

  try {
    const headers =
      method === 'GET' ? {} : { 'Content-Type': 'application/json' }
    const data = getPathValue(options, 'body')

    const request = axios.request({
      method,
      url,
      headers,
      data,
    })

    const response = await request

    return {
      statusCode: response.status,
      headers: response.headers,
      body: response.data,
    }
  } catch (err) {
    if (err.response) {
      return {
        statusCode: err.response.status,
        headers: err.response.headers,
      }
    } else {
      throw err
    }
  }
}

module.exports = {
  viaHandler,
  viaHttp,
}
