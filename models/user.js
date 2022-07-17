const mongoose = require('mongoose')

//схема пользователя в базе
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    require: true,
  }
})

module.exports = mongoose.model('user', userSchema)

