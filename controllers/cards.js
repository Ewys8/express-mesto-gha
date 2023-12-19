const http2 = require('http2');
const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const BadRequest = require('../errors/BadRequestError');
const NotFound = require('../errors/NotFoundError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .orFail()
        .populate('owner')
        .then((data) => res.status(http2.constants.HTTP_STATUS_CREATED).send(data))
        .catch((error) => {
          if (error instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFound('Не найдена карточка с указанным id'));
          } else {
            next(error);
          }
        });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(error.message));
      } else {
        next(error);
      }
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .orFail()
    .then(() => {
      res.status(http2.constants.HTTP_STATUS_OK).send({ message: 'Карточка успешно удалена' });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFound(`Не найдена карточка с id: ${cardId}.`));
      } else if (error instanceof mongoose.Error.CastError) {
        next(new BadRequest(`Получение карточки с некорректным id: ${cardId}.`));
      } else {
        next(error);
      }
    });
};

const addLike = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(http2.constants.HTTP_STATUS_OK).send(card);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFound(`Не найдена карточка с id: ${cardId}.`));
      } else if (error instanceof mongoose.Error.CastError) {
        next(new BadRequest(`Получение карточки с некорректным id: ${cardId}.`));
      } else {
        next(error);
      }
    });
};

const deleteLike = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(http2.constants.HTTP_STATUS_OK).send(card);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFound(`Не найдена карточка с id: ${cardId}.`));
      } else if (error instanceof mongoose.Error.CastError) {
        next(new BadRequest(`Получение карточки с некорректным id: ${cardId}.`));
      } else {
        next(error);
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  addLike,
  deleteLike,
};
