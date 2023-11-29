const http2 = require('http2');
const User = require('../models/user');

const addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(http2.constants.HTTP_STATUS_CREATED).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: error.message });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(http2.constants.HTTP_STATUS_OK).send(users)).orFail(new Error('Пользователи не найдены'))
    .catch(() => res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: `Пользователь по id: ${userId} не найден.` });
      } else {
        res.status(http2.constants.HTTP_STATUS_OK).send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Получение пользователя с некорректным id: ${userId}.` });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const editUserData = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, about }, { new: 'true', runValidators: true })
    .then((user) => res.status(http2.constants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: `Пользователь по id: ${userId} не найден.` });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: 'true', runValidators: true })
    .then((user) => res.status(http2.constants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: `Пользователь по id: ${userId} не найден.` });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
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
