const bcrypt = require('bcrypt'); // подключение шифровальщика
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // работа с БД модели User

const jwtLifeTime = '7d';

// создание нового пользователя
module.exports.createUser = (req, res) => {
  const { email, password } = req.body;
  // проверка наличия почты и пароля в запросе celebrate

  // проверка валидной почты на совпадение
  User.findOne({ email })
    .then((oldUser) => {
      if (oldUser) {
        return res.status(409).send({ message: `Пользователь с Email: ${oldUser.email} уже существует` });
      }
      //  запись пользователя в случае несовпадения почты
      // хеширование пароля полученного из запроса
      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({ email, password: hash }) // в базу записывается хеш
            .then((dataFromDB) => res.status(201).send(dataFromDB))
            .catch((err) => {
              if (err.name === 'ValidationError') {
                return res.status(400).send({ message: `Произошла ошибка: ${err}` });
              }
              return res.status(500).send({ message: `Произошла ошибка: ${err}` });
            });
        });
    })
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Email или пароль не переданы' });
  }
  // проверка на валидность почты
  if (!validator.isEmail(email)) {
    return res.status(400).send({ message: 'Введен некорректный Email' });
  }
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(403).send({ message: 'Такого пользователя не существует' });
      }
      bcrypt.compare(password, user.password, (err, isValidPassword) => {
        if (!isValidPassword) {
          return res.status(401).send({ message: 'пароль неверный' });
        }
        const token = jwt.sign({ id: user._id }, 'strongSecret', { expiresIn: jwtLifeTime });
        return res.cookie('access_token', token, { httpOnly: true }).status(200).send({ message: 'token передан' }); // отправка токена в куки
      });
    })
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
};

module.exports.logout = (req, res) => res.clearCookie('access_token').status(200).send({ message: 'Токен удален' });

module.exports.authUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Email или пароль не переданы' });
  }
  User.findOne({ email })
    .then((oldUser) => {
      if (oldUser) {
        return res.status(409).send({ message: `Пользователь с Email: ${oldUser.email} уже существует` });
      }
    });
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.id)
    .then((userFromBD) => {
      if (!userFromBD) {
        return res.status(404).send({ message: 'Произошла ошибка: Пользователь не найден' });
      }
      return res.send(userFromBD);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: `Произошла ошибка: ${err}` });
      }
      return res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((dataFromDB) => res.send(dataFromDB))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
};
//--------------------------------------------------------
module.exports.profileUserUpdate = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((dataFromDB) => res.send({ message: dataFromDB }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Произошла ошибка: ${err}` });
      }
      return res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.avatarUserUpdate = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      runValidators: true,
      new: true,
    },
  )
    .then((dataFromDB) => res.send({ dataFromDB }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Произошла ошибка: ${err}` });
      }
      return res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.getRegisteredUser = (req, res) => {
  if (!req.user) {
    return res.status(404).send({ message: 'Пользователь не авторизован' });
  }
  User.findById(req.user._id)
    .then((dataFromDB) => res.send(dataFromDB))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
};
