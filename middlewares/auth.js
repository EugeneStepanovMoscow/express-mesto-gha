const jwt = require('jsonwebtoken');
const notFoundError = require('../errors/notFoundError');

module.exports.authCheck = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, 'strongSecret', (err, decodet) => {
    //jwt.verify(token.split('=', 2)[1], 'strongSecret', (err, decodet) => {
      if (err) {
        console.log('ошибка раскодировки токена')
        throw new notFoundError(`Ошибка верификации токена ${err}`);
      }
      req.user = {
        _id: decodet.id,
      };
      console.log(req.user);
      return req.user;
    });
  } else {
    console.log(`Токен не найден`)
    throw new notFoundError(`Токен не найден`);
  }
  next();
};
