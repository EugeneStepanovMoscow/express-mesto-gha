const mongoose = require('mongoose')

//схема пользователя в базе
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    require: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    require: true,
  },
  avatar: {
    type: String,
    require: true,
  }
})

module.exports = mongoose.model('user', userSchema)

