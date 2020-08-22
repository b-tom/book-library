require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const createError = require('http-errors');

//Set up the database
require('./configs/db.config');

//bind user to view - locals
const bindUserToViewLocals = require('./configs/user-locals.config');

const app = express();
require('./configs/session.config')(app);

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended:true}));
app.use(cookieParser());

app.use(bindUserToViewLocals);

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);


// default value for title local
app.locals.title = 'Book Library';


//Routers
app.use('/', require('./routes/index'));
app.use('/books', require('./routes/books-routes/books'));
app.use('/authors', require('./routes/authors-routes/authors'));
app.use('/auth', require('./routes/auth-routes/auth'));
app.use('/', require('./routes/comment-routes/comment'));

//Catch missing routes and forward to error handler
app.use((req, res, next) => next(createError(404)));

//Catch all error handler
app.use((error, req, res) => {
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};

  res.status(error.status || 500);
  res.render('error');
});

module.exports = app;
