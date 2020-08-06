const express = require('express');
const router  = express.Router();
const Book = require('../../models/Book.model.js');

//GET Books Page
router.get('/', (req,res) => {
  Book.find()
  .then(allTheBooksFromDB => {
    console.log('Retreived books from DB', allTheBooksFromDB);
    res.render('book-views/books-list', { books: allTheBooksFromDB });
  })
  .catch(error => console.log('Error while retreiving books', error));
});

//GET route to display the Form to create a new book
router.get('/create', (req, res, next) => {
  res.render('book-views/book-create');
});

//POST Route to save new book to the database
router.post('/create', (req, res, next) => {
  console.log( {body: req.body} );
  Book.create(req.body)
      .then((createdBook) => {
        res.render(`book-views/book-details`, {book: createdBook});
      })
      .catch(error => console.log(`Error while creating book: ${error}`));
});

//GET route to display de selected book details (by the book id)
router.get('/details/:bookId', (req, res, next) => {
  Book.findById(req.params.bookId)
  .then((theBook) => {
    console.log(`The ID from the URL is: ${theBook._id}`);
    console.log(`The Book Information is: ${theBook}`);
    res.render('book-views/book-details', {book: theBook});
  })
  .catch(error => console.log('error while retrieving book',error));
});

// //GET route to update information about the book
router.get('/edit/:bookId', (req, res, next) => {
  const { bookId } = req.params;

  Book.findById(bookId)
    .then(bookToEdit => {
      console.log(bookToEdit);
      res.render('book-views/book-edit', {book: bookToEdit});
    })
    .catch(error => console.log(`Error while getting the book to edit${error}`));
});

//POST route to update information about the book
router.post('/edit/:bookId', (req, res, next) => {
  Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true })
    .then((updatedBook) => {
      console.log(`Updated Book information ${updatedBook}`);
      res.redirect(`/books`);
    })
    .catch(err => console.log(`Error while updating the book: ${err}`));
});

//POST route to delete a book
router.post("/delete/:bookId", (req, res, send) => {
  Book.findByIdAndDelete(req.params.bookId)
    .then(() => {
      res.redirect("/books");
    })
    .catch(error => `Error while deleting Book: ${error}`);
});

module.exports = router;