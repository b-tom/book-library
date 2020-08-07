const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const authorSchema = new Schema (
  {
    fullName: String,
    dateOfBirth: Date,
    nacionality: String,
    awardWinner: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: '/images/default-author.png'
    },
    books: {
      type: [{ type: Schema.Types.ObjectId, ref:"Book"}],
    }
  },
  {
    timestamp: true
  }
);

module.exports = model('Author', authorSchema)