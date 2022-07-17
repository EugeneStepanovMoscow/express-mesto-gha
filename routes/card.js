const router = require('express').Router()
const Card = require('../models/card') //работа с БД модели Card
//подключение
const {getAllCards,
       addCard,
       deleteCard,
       addLike,
       deleteLike} = require('../controllers/cards')

const bodyParser = require('body-parser')
router.use(bodyParser.json());
// Получаем все карточки
router.get('/', getAllCards);
// Добавляем карточку
router.post('/', addCard)
//Удаление карточки по ID
router.delete('/:id', deleteCard);
//поставить лайк карточке
router.put('/:cardId/likes', addLike);
//убрать лайк с карточки
router.delete('/:cardId/likes', deleteLike);

module.exports = router;