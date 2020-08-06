const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const bookSchema = new Schema(
  {
    title: String,
    description: String,
    author: String,
    rating: Number,
    image: {
      type: String,
      default: '/images/books.jpg'
    }
  },
  {
  timestamp: true
  }
);

module.exports = model('Book', bookSchema);