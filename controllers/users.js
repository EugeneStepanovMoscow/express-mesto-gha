const User = require('../models/user'); // работа с БД модели User

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((dataFromDB) => res.send(dataFromDB))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Произошла ошибка: ${err}` });
      }
      return res.status(500).send({ message: `Произошла ошибка: ${err}` });
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
    .catch((err) => res.status(400).send({ message: `Произошла ошибка: ${err}` }));
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
