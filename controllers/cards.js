const Card = require('../models/card') //работа с БД модели Card

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((dataFromDB) => res.send(dataFromDB))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}`}))
}

module.exports.addCard = (req, res) => {
  const {name, link} = req.body
  if ((!name) || (!link)) {
    return res.status(400).send({ message: `Произошла ошибка: Не заполнены все поля`})
  }
  const owner = req.user._id
  Card.create({name, link, owner})
    .then((dataFromDB) => res.send(dataFromDB))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Произошла ошибка: ${err}`})
      } else {
        return res.status(500).send({ message: `Произошла ошибка: ${err}`})
      }
    })
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((dataFromBD) => {
      res.send({ message: `Карточка с именем: ${dataFromBD.name} удалена`})
    })
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err}`}));
}

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: req.user._id}},
    {new: true},
    // (err) => {
    //   if (err) {
    //     res.status(404).send({message: err})
    //   }
    )
      .then((dataFromBD) => {
        res.status(201).send({dataFromBD})
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res.status(404).send({ message: `Произошла ошибка: ${err}`})
        } else {
          return res.status(400).send({ message: `Произошла ошибка: ${err}`})
        }
      })
}

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true})
      .then((dataFromBD) => {
        if (!dataFromBD) {
          return res.status(400).send({ message: `Произошла ошибка: Карточка не найдена`})
        }
        res.status(200).send({dataFromBD})
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res.status(400).send({ message: `Произошла ошибка: ${err}`})
        } else {
          return res.status(404).send({ message: `Произошла ошибка: ${err}`})
        }
      })
}