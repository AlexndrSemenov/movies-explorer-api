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
const errorHandler = require('./src/middlewares/errorHandler');

const { NODE_ENV, MONGO_SERVER } = process.env;
const {
  MONGO_SERVER_DEV, ERROR_PATH, CONNECTED_TO_DB, APP_LISTENING_ON,
} = require('./src/utils/constants');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();
const serverBd = NODE_ENV === 'production' ? MONGO_SERVER : MONGO_SERVER_DEV;

// подключаем логгер запросов до обработчиков всех роутов
app.use(requestLogger);

// подключаем rate-limiter
app.use(limiter);

// добавляем bodyParser по-новому
app.use(express.json());

// разрешаем кроссдоменные запросы
app.use(cors());

// подключаем роутер
app.use('/', movieRouter);
app.use('/', userRouter);

app.use(auth, (req, res, next) => {
  next(new NotFoundError(ERROR_PATH));
});

app.use(errorLogger); // подключаем логгер ошибок после обработчиков роутов и до обработчиков ошибок
// обработчик ошибок celebrate
app.use(errors());
// здесь обрабатываем все ошибки
app.use(errorHandler);

(async function main() {
  await mongoose.connect(serverBd);
  console.log(CONNECTED_TO_DB);

  app.listen(PORT);
  console.log(`${APP_LISTENING_ON} ${PORT}`);
}());
