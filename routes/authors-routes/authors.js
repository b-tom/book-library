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




module.exports = router;