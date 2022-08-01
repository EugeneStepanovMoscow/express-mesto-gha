const express = require('express'); // подключаем экспресс
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUser = require('./routes/user');
const routerCard = require('./routes/card');
const { createUser, login, logout } = require('./controllers/users');
const { authCheck } = require('./middlewares/auth');
const { isOwner } = require('./middlewares/isOwner')

const { PORT = 3000 } = process.env; // присваиваем номер порта из окружения или 3000 по умолчанию

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
app.use('/signup', createUser);
app.use('/signin', login);

app.use(authCheck);

app.use('/users', routerUser);
app.use('/signout', logout);

app.use(isOwner);

app.use('/cards', routerCard);


app.use((req, res) => res.status(404).send({ message: 'Страница не найдена' }));

app.listen(PORT, () => {
  // console.log(`App listening on port ${PORT}`);
});
