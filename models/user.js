const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlenght: [2, 'Минимальная длина поля - 2'],
    maxlenght: [30, 'Максимальная длина подя - 30'],
  },
  about: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlenght: [2, 'Минимальная длина поля - 2'],
    maxlenght: [30, 'Максимальная длина подя - 30'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator(url) {
        return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(url);
      },
      message: 'Некорректный URL',
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
