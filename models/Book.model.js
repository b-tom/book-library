const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const bookSchema = new Schema(
  {
    title: String,
    description: String,
    author: {
      type: [{ type: Schema.Types.ObjectId, ref: "Author"}]
    },
    rating: Number,
    image: {
      type: String,
      default: '/images/books.jpg'
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
  },
  {
  timestamp: true
  }
);

module.exports = model('Book', bookSchema);