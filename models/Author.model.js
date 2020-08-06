const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const authorSchema = new Schema (
  {
    firstName: String,
    lastName: String,
    fullName: String,
    dateOfBirth: Date,
    nacionality: String,
    awardsWinner: Boolean
  },
  {
    timestamp: true
  }
);

module.exports = model('Author', authorSchema)