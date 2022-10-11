const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const { errors } = require('celebrate');// здесь обрабатываем ошибки валидации celebrate
const cors = require('cors');
const userRouter = require('./src/routes/users');
const movieRouter = require('./src/routes/movies');
const limiter = require('./src/controllers/rateLimiter');
const NotFoundError = require('./src/errors/not-found-err'); // 404
const { requestLogger, errorLogger } = require('./src/middlewares/logger');
const auth = require('./src/middlewares/auth');

const { NODE_ENV, MONGO_SERVER } = process.env;

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();
const serverBd = NODE_ENV === 'production' ? MONGO_SERVER : 'mongodb://localhost:27017/moviesdb';

// подключаем rate-limiter
app.use(limiter);
// добавляем bodyParser по-новому
app.use(express.json());

// разрешаем кроссдоменные запросы
app.use(cors());

app.use(requestLogger); // подключаем логгер запросов до обработчиков всех роутов
// подключаем роутер
app.use('/', movieRouter);
app.use('/', userRouter);

app.use(auth, (req, res, next) => {
  next(new NotFoundError('Неправильный путь'));
});

app.use(errorLogger); // подключаем логгер ошибок после обработчиков роутов и до обработчиков ошибок
// обработчик ошибок celebrate
app.use(errors());
// здесь обрабатываем все ошибки
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
});

(async function main() {
  await mongoose.connect(serverBd);
  console.log('Connected to db');

  app.listen(PORT);
  console.log(`App listening on ${PORT}`);
}());
