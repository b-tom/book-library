const express = require('express');
const router  = express.Router();
const Author = require('../../models/Author.model.js');

//GET Authors Page
router.get('/', (req, res, next) => {
  Author.find()
  .then(allTheAuthorsFromDB => {
    console.log(`Retreived authors from DB ${allTheAuthorsFromDB}`);
    res.render('author-views/authors-list', { authors: allTheAuthorsFromDB });
  })
  .catch(err => console.log(`Error while retreiving authors ${err}`));
});

//GET route to display the Form to create a new book
router.get('/create', (req, res, next) => {
  res.render('author-views/author-create');
});

//POST Route to save the new author to the database
router.post('/create', (req, res, next) => {
  console.log( {body: req.body} );
  Author.create(req.body)
    .then((createdAuthor) => {
      res.render(`author-views/authors-details`, {author: createdAuthor});
    })
    .catch(error => console.log(`Error while creating author ${error}`));
});

//GET route to display the selected author details (by author id)
router.get('/details/:authorId', (req, res, next) => {
  Author.findById(req.params.authorId)
  .then((theAuthor) => {
    console.log(`The Author information is ${theAuthor}`);
    res.render('author-views/authors-details', {author: theAuthor})
  })
  .catch(err => console.log(`Error while retreiving author ${err}`));
});

//GET route to update information about the author
router.get('/edit/:authorId', (req, res, next) => {
  const { authorId } = req.params;

  Author.findById(authorId)
    .then(authorToEdit => {
      console.log(authorToEdit);
      res.render('author-views/authors-edit', { author: authorToEdit });
    })
    .catch( err => console.log(`Error while getting the author to edit ${err}`));
});

//POST route to update information about the author
router.post('/edit/:authorId', (req, res, next) => {
  Author.findByIdAndUpdate(req.params.authorId, req.body, { new:true })
    .then((updatedAuthor) => {
      console.log(`Update book information ${updatedAuthor}`);
      res.redirect(`/authors`);
    })
    .catch(err => console.log(`Error while updating the author: ${err}`));
});

//POST route to delete an author
router.post('/delete/:authorId', (req, res, next) => {
  Author.findByIdAndDelete(req.params.authorId)
    .then(() => {
      res.redirect("/authors");
    })
    .catch(err => console.log(`Error while deleting author: ${err}`));
});

module.exports = router;