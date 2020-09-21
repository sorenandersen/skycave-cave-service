const isValidPositionFormat = (position) => {
  const pattern = /^\(-?\d+,-?\d+,-?\d+\)$/
  return pattern.test(position)
}

module.exports = {
  isValidPositionFormat,
}
