const express = require('express'); // подключаем экспресс
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUser = require('./routes/user');
const routerCard = require('./routes/card');
const { createUser, login, logout } = require('./controllers/users');
const { authCheck } = require('./middlewares/auth');
const { errorsCheck } = require('./middlewares/errors');
const { celebrate, Joi, errors} = require('celebrate');

const { PORT = 3000 } = process.env; // присваиваем номер порта из окружения или 3000 по умолчанию

const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([\da-z\.]{2,6})([\/\d\w \.-]*)*\/?$/i

// подключаемся к серверу базы
// !!!!!!При включении параметров useCreateIndex и useFindAndModify выдает ошибку!!!!!!
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true
  // useFindAndModify: true
});

const app = express();

app.use(bodyParser.json());

app.use('/signout', logout);
app.use('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlPattern),
  }).unknown(true),
}), createUser);
app.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
  })
}), login);

app.use(authCheck); // проверка авторизации;

app.use('/users', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlPattern),
  })
}), routerUser);

app.use('/signout', logout);

app.use('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(urlPattern),
  })
}), routerCard);

// app.use((req, res) => res.status(404).send({ message: 'Страница не найдена' }));

app.use(errors()); // обработка ошибок сгенерированных Joi

app.use(errorsCheck);

app.listen(PORT, () => {
  // console.log(`App listening on port ${PORT}`);
});
