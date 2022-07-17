const mongoose = require('mongoose')

//схема пользователя в базе
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    require: true,
  },
  link: {
    type: String,
    require: true,
  },
  owner: {
    type: String,
    require: true,
  },
  likes: {
    type: Array,
    require: true,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

module.exports = mongoose.model('card', cardSchema)

