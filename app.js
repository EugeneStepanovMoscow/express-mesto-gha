const express = require('express'); // подключаем экспресс
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const corsUnit = require('cors');
const routerUser = require('./routes/user');
const routerCard = require('./routes/card');
const { createUser, login, logout } = require('./controllers/users');
const { authCheck } = require('./middlewares/auth');
const { errorsCheck } = require('./middlewares/errors');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env; // присваиваем номер порта из окружения или 3000 по умолчанию

const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([\da-z\.]{2,6})([\/\d\w \.-]*)*\/?$/i;

// подключаемся к серверу базы
// !!!!!!При включении параметров useCreateIndex и useFindAndModify выдает ошибку!!!!!!
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true
  // useFindAndModify: truenpm run dev

});

const app = express();

// app.use(corsUnit());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(corsUnit());

// const allowedCors = [
//   'http://localhost:3001',
//   '://localhost:3001',
//   'localhost:3001',

// ];

// app.use((req, res, next) => {
//   const { origin } = req.headers;
//   const { method } = req;
//   const requestHeaders = req.headers['access-control-request-headers'];
//   const DEFAULT_ALLOWED_METHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE';

//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//     res.header('Access-Control-Allow-Credentails', true);
//   } else if ((method === 'OPTIONS')) {
//     res.header('Access-Control_Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     res.end();
//   }
//   next();
// });

// app.use((req, res, next) => {
//   const { origin } = req.headers;
//   const { method } = req;
//   const requestHeaders = req.headers['access-control-request-headers'];
//   const DEFAULT_ALLOWED_METHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE';

//     res.header('Access-Control-Allow-Origin', origin);
//     res.header('Access-Control-Allow-Credentails', true);

//     res.header('Access-Control_Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     res.end();
//   next();
// });



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
  }),
}), login);

app.use(authCheck); // проверка авторизации;

app.use('/users', routerUser);

app.use('/signout', logout);

app.use('/cards', routerCard,);

app.use(errors()); // обработка ошибок сгенерированных Joi

app.use(errorsCheck);

app.listen(PORT, () => {
  // console.log(`App listening on port ${PORT}`);
});
