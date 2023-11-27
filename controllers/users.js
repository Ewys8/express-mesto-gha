const User = require('../models/user');

const addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: `Пользователь по id: ${userId} не найден.` });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: `Получение пользователя с некорректным id: ${userId}.` });
      } else {
        res.status(500).send({ message: 'Ошибка сервера.' });
      }
    });
};

const editUserData = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  if (userId) {
    User.findByIdAndUpdate(userId, { name, about }, { new: 'true', runValidators: true })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: err.message });
        } else {
          res.status(404).send({ message: `Пользователь по id: ${userId} не найден.` });
        }
      });
  } else {
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
  }
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  if (userId) {
    User.findByIdAndUpdate(userId, { avatar }, { new: 'true', runValidators: true })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: err.message });
        } else {
          res.status(404).send({ message: `Пользователь по id: ${userId} не найден.` });
        }
      });
  } else {
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports = {
  addUser,
  getUsers,
  getUserById,
  editUserData,
  updateUserAvatar,
};
