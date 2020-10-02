const { deleteTestData } = require('./manageTestData')

// Jest global teardown.
// Global setup module that is triggered once after all test suites.
// https://jestjs.io/docs/en/configuration#globalteardown-string
module.exports = async () => {
  deleteTestData()
}
