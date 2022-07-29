const router = require('express').Router();
// подключение контроллеров

const {
  findUser,
  getAllUsers,
  profileUserUpdate,
  avatarUserUpdate,
  getRegisteredUser,
} = require('../controllers/users');

// получаем всх пользователей
router.get('/', getAllUsers);

router.get('/me', getRegisteredUser);
// изменение аватара
// Добавляем пользователя
router.get('/:id', findUser);
// обновление профиля

router.patch('/me', profileUserUpdate);

// изменение аватара
router.patch('/me/avatar', avatarUserUpdate);

module.exports = router;
