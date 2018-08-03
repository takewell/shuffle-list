const config = require('../config');
const jwt = require('jsonwebtoken');

module.exports = (userId, seconds) => {
  const apiToken = jwt.sign(
    { userId: userId, expire: Math.floor(Date.now() / 1000) + seconds },
    config.SECRET
  );
  return apiToken;
};