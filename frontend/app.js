var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// app.use((req, res, next) => {
//   console.log("authorize-client");
//   if (!req.client.authorized) {
//     res.status(403).send("unauthorized");
//   } else {
//     console.log("authorized");
//     return next();
//   }
// });

const session = require('express-session');
app.use(session({
  secret: 'my-secret',  // a secret string used to sign the session ID cookie
  resave: false,  // don't save session if unmodified
  saveUninitialized: false  // don't create session until something stored
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://Jason4931:cSbqK0jfvZpsoICA@cluster0.csawbwp.mongodb.net/perpus?retryWrites=true&w=majority&appName=Cluster0');
// mongoose.connect('mongodb+srv://mada:ARSM9i90epWJLRdp@cluster0.02eby.mongodb.net/perpus?retryWrites=true&w=majority&appName=Cluster0');


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.listen(3000, function () {
//   console.log('listening on port ' + 3000 + '!');
// });

module.exports = app;
