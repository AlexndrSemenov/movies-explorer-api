const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err'); // 400
const NotFoundError = require('../errors/not-found-err'); // 404
const AlreadExistsErr = require('../errors/already-exists-err'); // 409
const { ERROR_DATA_USERS, ALREADY_REGISTERED, UNKNOUN_USER_ID } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

exports.createUser = (req, res, next) => { // регистрация пользователя
  const {
    email, name,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email,
      password: hash, // записываем хеш в базу
      name,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_DATA_USERS));
      } else if (err.code === 11000) {
        next(new AlreadExistsErr(ALREADY_REGISTERED));
      } else {
        next(err);
      }
    });
};

exports.login = (req, res, next) => { // аутентификация(вход на сайт) пользователя
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => { // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch(next);
};

exports.getUsersMe = (req, res, next) => User.findById(req.user._id)
  .orFail(new Error('NotValididId'))
  .then((user) => res.send(user))
  .catch((err) => {
    if (err.message === 'NotValididId') {
      next(new NotFoundError(UNKNOUN_USER_ID));
    } else {
      next(err);
    }
  });

exports.updateUserProfile = (req, res, next) => {
  const { email, name } = req.body;
  const myId = req.user._id;
  User.findByIdAndUpdate(myId, { email, name }, { new: true, runValidators: true })
    .orFail(new Error('NotValididId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValididId') {
        next(new NotFoundError(UNKNOUN_USER_ID));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_DATA_USERS));
      } else if (err.code === 11000) {
        next(new AlreadExistsErr(ALREADY_REGISTERED));
      } else {
        next(err);
      }
    });
};
