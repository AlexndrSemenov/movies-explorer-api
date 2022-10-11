const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err'); // 400
const NotFoundError = require('../errors/not-found-err'); // 404
const AnotherCardErr = require('../errors/another-card-err'); // 403

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
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
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
        next(new AnotherCardErr('Невозможно удалить чужую карточку'));
      }
    } else {
      next(new NotFoundError('Передан некорректный id карточки'));
    }
  } catch (err) { next(err); }
};
