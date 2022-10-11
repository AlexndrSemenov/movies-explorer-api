const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const mongoose = require('mongoose');
const AuthorizationError = require('../errors/authorization-err');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // Так по умолчанию хеш пароля пользователя не будет возвращаться из базы.
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

// аутентификация пользователя
// добавим метод findUserByCredentials схеме пользователя
// у него будет два параметра — почта и пароль
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password') // проверим, есть ли пользователь в базе
    .then((user) => {
      if (!user) { // пользователь с такой почтой не найден
        return Promise.reject(new AuthorizationError('Неправильные логин или пароль')); // отклоняем промис с ошибкой и переходим в блок catch
      }
      // Если пользователь найден, проверим присланный пароль -
      // сравним с паролем данного пользователя в баще
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizationError('Неправильные логин или пароль')); // хеши не совпали — отклоняем промис
          }
          return user; // теперь user доступен
        });
    });
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
