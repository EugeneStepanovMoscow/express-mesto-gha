const jwt = require('jsonwebtoken');

module.exports.authCheck = (req, res, next) => {
  const token = req.headers.cookie;
  if (token) {
    jwt.verify(token.split('=', 2)[1], 'strongSecret', (err, decodet) => {
      if (err) {
        return res.status(401).send({ message: err });
      }
      return req.user = {
        _id: decodet.id,
      };
    });
  } else {
    return res.status(401).send({ message: 'Необходимо пройти авторизацию' });
  }
  next();
};
