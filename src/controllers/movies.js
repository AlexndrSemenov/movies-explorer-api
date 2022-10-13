const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err'); // 400
const NotFoundError = require('../errors/not-found-err'); // 404
const AnotherCardErr = require('../errors/another-card-err'); // 403
const { ERROR_DATA_CREATE_CARD, ALIEN_CARD, ERROR_ID_CARD } = require('../utils/constants');

exports.createMovie = (req, res, next) => {
  const {
    country,
    director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_DATA_CREATE_CARD));
      } else {
        next(err);
      }
    });
};

exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movie) => res.send(movie))
    .catch(next);
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { movieId } = req.params;
    const deletedMovie = await Movie.findById(movieId);
    if (deletedMovie) {
      if (deletedMovie.owner.toString() === userId) {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((movie) => res.send(movie))
          .catch(next);
      } else {
        next(new AnotherCardErr(ALIEN_CARD));
      }
    } else {
      next(new NotFoundError(ERROR_ID_CARD));
    }
  } catch (err) { next(err); }
};
