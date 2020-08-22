const express = require('express');
const router = express.Router();

const Book = require('../../models/Book.model.js');
const Comment = require('../../models/Comment.model');

//post route to save to database a new comment on a specific post
router.post('/books/details/:bookId/comment', (req, res, next) => {
  const { bookId } = req.params;
  const { content } = req.body;

  //find a book based on the id from the url
  Book.findById(bookId)
    .then(bookFromDB => {
      //Create a new comment
      Comment.create({ content, author: req.session.loggedInUser._id })
        .then(newCommentFromDb => {
          //push the new comment's id into an array of comments that belongs to the found post
          bookFromDB.comments.push(newCommentFromDb._id);

          //save the post with the new comments on it to the database
          bookFromDB
            .save()
            .then(updatedBook => res.redirect(`/books/details/${updatedBook._id}`))
            .catch(err => console.log(`Err while saving a comment in a book: ${err}`));
        })
        .catch(err => console.log(`Err while creating a comment on a book: ${err}`));
    })
    .catch(err => console.log(`Err while getting a single book when creating a comment: ${err}`));
});

module.exports = router;
