const express = require('express');
const router  = express.Router();
const Book = require('../../models/Book.model.js');
const Author = require('../../models/Author.model.js');

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
  const newBook = {
    title: req.body.title,
    description: req.body.description,
    rating: req.body.rating,
    image: req.body.image
  }
  

  Book.create(newBook)
      .then((createdBook) => {
        res.redirect(`/books/details/${createdBook._id}` );
      })
      .catch(error => console.log(`Error while creating book: ${error}`));
});

//GET route to display the selected book details (by the book id)
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
    .then((bookToEdit) => {
      Author.find()
        .then((authors) => {
          const data = {
            ...bookToEdit,
            authors,
            edit: true,
          };
          console.log(data)
          res.render("book-views/book-edit", data);
        })
        .catch((err) => {
          console.log(`Error getting authors when editing books: ${err}`);
        });
    })
    .catch(error => console.log(`Error while getting the book to edit${error}`));
});

//POST route to update information about the book
router.post('/edit/:bookId', (req, res, next) => {
  Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true })
    .then((updatedBook) => {
      Author.find({_id: {$in: updatedBook.author } })
        .then(async (authorsArray) => {
          await authorsArray.forEach(async (author) => {
            if(!author.books.includes(req.params.bookId)) {
              author.books.push(req.params.bookId);
              await author.save();
            }
          });
          res.redirect(`/books/details/${updatedBook._id}`);
        })
        .catch((err) => console.log(`error getting authors from books array: ${err}`));
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