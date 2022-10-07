const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err'); // 400
const NotFoundError = require('../errors/not-found-err'); // 404
// const AnotherCardErr = require('../errors/another-card-err'); // 403

exports.createMovie = (req, res, next) => {
  // const { name, link } = req.body;
  const { country, director, duration, year, description, image, trailerLink, thumbnail, nameRU, nameEN } = req.body;
  const owner = req.user._id;

  // Card.create({ name, link, owner: ownerId })
  Movie.create({ country, director, duration, year, description, image, trailerLink, thumbnail, nameRU, nameEN, owner: owner })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

// exports.getCards = (req, res, next) => Card.find({})
//   // .populate(['owner'])
//   .then((cards) => res.send(cards))
//   .catch(next);
exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
  .then((movie) => res.send(movie))
  .catch(next);
}


module.exports.deleteMovie = async (req, res, next) => {
  try {
    // const userId = req.user._id;
    const { movieId } = req.params;
    const deletedMovie = await Movie.findById(movieId);
    if (deletedMovie) {
      // if (deletedMovie.owner.toString() === userId) {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((movie) => res.send(movie))
          .catch(next);
      // } else {
      //   next(new AnotherCardErr('Невозможно удалить чужую карточку'));
      // }
    } else {
      next(new NotFoundError('Передан некорректный id карточки'));
    }
  } catch (err) { next(err); }
};

// exports.likeCard = (req, res, next) => {
//   const myId = req.user._id;
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: myId } }, // добавить элемент в массив, еслиеготамещёнет(только для монго)
//     { new: true },
//   )
//     .orFail(() => new NotFoundError('При постановке лайка передан несуществующий _id карточки'))
//     .then((card) => res.send(card))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
//       } else {
//         next(err);
//       }
//     });
// };

// exports.dislikeCard = (req, res, next) => {
//   const myId = req.user._id;
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: myId } }, // см. выше
//     { new: true },
//   )
//     // orFail также как и здесь можно сделать в controllers - users.js
//     .orFail(() => new NotFoundError('При удалении лайка передан несуществующий _id карточки'))
//     .then((card) => res.send(card))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
//       } else {
//         next(err);
//       }
//     });
// };
