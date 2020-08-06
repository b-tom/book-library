const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const bookSchema = new Schema(
  {
    title: String,
    description: String,
    author: String,
    rating: Number
  },
  {
  timestamp: true
  }
);

module.exports = model('Book', bookSchema);