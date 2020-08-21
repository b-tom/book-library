const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../../models/User.model');
const mongoose = require('mongoose');
const routeGuard = require('../../configs/route-guard.config');

////////// --- SIGNUP --- //////////

//.get route for users to signup
router.get('/signup', (req, res) => {
  res.render('auth-views/signup-form');
});

// .post route to process the form data
router.post('/signup', (req,res) => {
  const { username, email, password } = req.body;

  if(!username || !email || ! password ){
    res.render('auth-views/signup-form', { errorMessage: 'All fields are mandatory' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if(!regex.test(password)) {
    res.status(500).render('auth-views/signup-form', {
      errorMessage: 'Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.'
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        email,
        passwordHash: hashedPassword
      });
    })
    .then(userDoc => {
      console.log('Newly created user: ', userDoc);
      res.redirect('/login');
    })
    .catch(err => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth-views/signup-form', { errorMessage: err.message });
      } else if (error.code === 11000) {
        res.status(500).render('auth-views/signup-form', {
          errorMessage: 'Username and email need to be unique. Either username or email are already used.'
        });
        next(err);
      }
    });
});

////////// --- LOGIN --- //////////

//.get() route to display login form to users
router.get('/login', (req, res) => {
  res.render('auth-views/login-form')
});

//.post() route to process the data 
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if(email === '' || password ===''){
    res.render('auth-views/login-form', { 
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
  
  User.findOne( { email })
    .then(user => {
      if(!user) {
        res.render('auth-views/login-form', {
          errorMessage: 'Email is not registered. Try with other email.'
        });
        return;
      } else if(bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.loggedInUser = user;
        res.redirect('/auth/profile');
      } else {
        res.render('auth-views/login-form', {
          errorMessage: 'Incorrect password.'
        });
      }
    })
    .catch(error => next(error));
});
////////// --- LOGOUT --- //////////

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/profile', routeGuard, (req, res) => {
  res.render('users-views/user-profile');
});

module.exports = router ;