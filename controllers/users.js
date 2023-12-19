const http2 = require('http2');
const { default: mongoose } = require('mongoose');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequestError');
const NotFound = require('../errors/NotFoundError');

const addUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(http2.constants.HTTP_STATUS_CREATED).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(error.message));
      } else {
        next(error);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(http2.constants.HTTP_STATUS_OK).send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(http2.constants.HTTP_STATUS_OK).send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new BadRequest(`Получение пользователя с некорректным id: ${userId}.`));
      } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFound(`Не найден пользователь с id: ${userId}.`));
      } else {
        next(error);
      }
    });
};

const editUserData = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, about }, { new: 'true', runValidators: true })
    .orFail()
    .then((user) => res.status(http2.constants.HTTP_STATUS_OK).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(error.message));
      } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFound(`Не найден пользователь с id: ${userId}.`));
      } else {
        next(error);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: 'true', runValidators: true })
    .orFail()
    .then((user) => res.status(http2.constants.HTTP_STATUS_OK).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(error.message));
      } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFound('Не найден пользователь с указанным id.'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  addUser,
  getUsers,
  getUserById,
  editUserData,
  updateUserAvatar,
};
