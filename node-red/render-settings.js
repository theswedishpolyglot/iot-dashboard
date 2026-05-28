module.exports = {
  uiHost: '0.0.0.0',
  uiPort: process.env.PORT || 1880,
  disableEditor: process.env.NODE_RED_ENABLE_EDITOR !== 'true',
  credentialSecret: process.env.NODE_RED_CREDENTIAL_SECRET || 'iot-development-secret'
};
