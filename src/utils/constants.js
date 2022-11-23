const ALLOW_CORS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://alex.movies.nomoredomains.icu',
  'http://api.alex.movies.nomoredomains.icu',
  'https://alex.movies.nomoredomains.icu',
  'https://api.alex.movies.nomoredomains.icu',
];

const ERROR_PATH = 'Неправильный путь';
const MONGO_SERVER_DEV = 'mongodb://localhost:27017/moviesdb';
const CONNECTED_TO_DB = 'Connected to db';
const APP_LISTENING_ON = 'App listening on';
const ERROR_DATA_CREATE_CARD = 'Переданы некорректные данные при создании карточки';
const ALIEN_CARD = 'Невозможно удалить чужую карточку';
const ERROR_ID_CARD = 'Передан некорректный id карточки';
const ERROR_DATA_USERS = 'Переданы некорректные данные при создании/редактировании пользователя';
const ALREADY_REGISTERED = 'Данный емайл уже зарегистрирован';
const UNKNOUN_USER_ID = 'Пользователь по указанному _id не найден';
const NEED_AUTORIZATION = 'Необходима авторизация';
const ERROR_SERVER = 'На сервере произошла ошибка';
const ERROR_URL = 'Неправильный формат ссылки';
const ERROR_EMAIL = 'Неправильный формат почты';
const ERROR_LOGIN_OR_PASSWORD = 'Неправильный формат почты';

module.exports = {
  ALLOW_CORS,
  ERROR_PATH,
  MONGO_SERVER_DEV,
  CONNECTED_TO_DB,
  APP_LISTENING_ON,
  ERROR_DATA_CREATE_CARD,
  ALIEN_CARD,
  ERROR_ID_CARD,
  ERROR_DATA_USERS,
  ALREADY_REGISTERED,
  UNKNOUN_USER_ID,
  NEED_AUTORIZATION,
  ERROR_SERVER,
  ERROR_URL,
  ERROR_EMAIL,
  ERROR_LOGIN_OR_PASSWORD,
};
