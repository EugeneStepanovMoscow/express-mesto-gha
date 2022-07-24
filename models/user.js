const mongoose = require('mongoose');

// схема пользователя в базе
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  email: {
    type: mongoose.Schema.email,
    required: true,
    unique: true,
    validate: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
    validate: true,
  }
});

module.exports = mongoose.model('user', userSchema);
