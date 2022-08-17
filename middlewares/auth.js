const jwt = require('jsonwebtoken');
const notFoundError = require('../errors/notFoundError');

module.exports.authCheck = (req, res, next) => {
  const token = req.headers.cookie;
  if (token) {
    jwt.verify(token.split('=', 2)[1], 'strongSecret', (err, decodet) => {
      if (err) {
        throw new notFoundError(`Ошибка верификации токена ${err}`);
      }
      req.user = {
        _id: decodet.id,
      };
      return req.user;
    });
  } else {
    throw new notFoundError(`Токен не найден`);
  }
  next();
};
