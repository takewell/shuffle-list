const apiTokenDecoder = require('./apiTokenDecoder');

module.exports = (req, res, next) => {
  const decodedApiToken = apiTokenDecoder(req);
  if (!decodedApiToken) {
    res.json({ status: 'NG', message: 'Api token not correct.' });
    return;
  }

  const isExpired = decodedApiToken.expire <= Math.floor(Date.now() / 1000);
  if (isExpired) res.json({ status: 'NG', message: 'Api token is expired.' });
  return next();
};