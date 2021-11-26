
module.exports.apiKeyIsValid = (apiKey) => {
  const apiKeyEnabled = process.env.API_KEY_ENABLED
  const storedApiKey = process.env.API_KEY

  if (apiKeyEnabled === 'true') {
    return storedApiKey === apiKey
  }

  return true
}
