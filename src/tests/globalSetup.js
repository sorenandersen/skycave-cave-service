const { insertTestData } = require('./manageTestData')

// Jest global setup.
// Global setup module that is triggered once before all test suites.
// https://jestjs.io/docs/en/configuration#globalsetup-string
module.exports = async () => {
  await insertTestData()
}
