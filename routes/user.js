const router = require('express').Router();
// подключение контроллеров

const {
  createUser,
  findUser,
  getAllUsers,
  profileUserUpdate,
  avatarUserUpdate,
} = require('../controllers/users');

// получаем всх пользователей
//+
router.get('/', getAllUsers);
// Добавляем пользователя
//+
router.post('/', createUser);
// получаем пользователя по его ID
//+
router.get('/:id', findUser);
// обновление профиля
//+
router.patch('/me', profileUserUpdate);
// изменение аватара
//+
router.patch('/me/avatar', avatarUserUpdate);

module.exports = router;
