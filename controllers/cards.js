const Card = require('../models/card'); // работа с БД модели Card

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((dataFromDB) => res.send(dataFromDB))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}` }));
};

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((dataFromDB) => {
      if (!dataFromDB) {
        return res.status(404).send({ message: 'Произошла ошибка: Карточка не найдена' });
      }
      return res.send(dataFromDB);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Произошла ошибка: ${err}` });
      }
      return res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};


module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!(card.owner._id.toString() === req.user._id)) {
        return res.status(401).send({message: `Нет прав для редактирования карточки`})
      }
      Card.findByIdAndDelete(req.params.id)
        .then((card) => {
          return res.status(200).send({message: `Карточка ${card.name} удалена`})
        })
        .catch ((err) => {
          return res.status(500).send({message: `Ошибка ${ers}`})
        })
    })
    .catch((err) => res.status(404).send(err));
};

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((dataFromBD) => {
      if (!dataFromBD) {
        return res.status(404).send({ message: 'Произошла ошибка: Карточка не найдена' });
      }
      return res.status(200).send({ dataFromBD });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Произошла ошибка: ${err}` });
      } if (err.name === 'CastError') {
        return res.status(400).send({ message: `Произошла ошибка: ${err}` });
      }
      return res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((dataFromBD) => {
      if (!dataFromBD) {
        return res.status(404).send({ message: 'Произошла ошибка: Карточка не найдена' });
      }
      return res.status(200).send({ dataFromBD });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Произошла ошибка: ${err}` });
      } if (err.name === 'CastError') {
        return res.status(400).send({ message: `Произошла ошибка: ${err}` });
      }
      return res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};
