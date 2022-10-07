const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  createMovie,
  getMovies,
  deleteMovie,
  // likeCard,
  // dislikeCard,
} = require('../controllers/movies');

router.post('/movies', auth, celebrate({
  body: Joi.object().keys({
    // name: Joi.string().required().min(2).max(30),
    // link: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),

    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
    trailerLink: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
    thumbnail: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    // movieId: Joi.string().required(),
  }),
}), createMovie);

router.get('/movies', auth, getMovies);

router.delete('/movies/:movieId', auth, celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).required(),
  }),
}), deleteMovie);

// router.put('/cards/:cardId/likes', auth, celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().length(24).hex().required(),
//   }),
// }), likeCard);

// router.delete('/cards/:cardId/likes', auth, celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().length(24).hex().required(),
//   }),
// }), dislikeCard);

module.exports = router;
