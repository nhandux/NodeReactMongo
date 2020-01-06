var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var i18n = require('i18n');
var logger = require('morgan');
var expHbs   = require('express-handlebars');
var mongoose = require('mongoose');
// Thư viện sử dụng ở bài 4
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var cors = require('cors');

var settings = require('./config/settings');
var database = require('./config/database');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var routerMember = require('./routes/member');
var routerBackend = require('./routes/backend');
var apiRouter = require('./routes/api');
var app = express();
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
mongoose.connect(database.dbStr);
mongoose.connection.on('error', function(err) {
  console.log('Error connect to Database: ' + err);
});

require('./config/passport');

var hbsConfig = expHbs.create({
  helpers: require('./helpers/handlebars.js').helpers,
  layoutsDir: path.join(__dirname, '/templates/' +  settings.defaultTemplate +  '/layouts'),
  defaultLayout: path.join(__dirname, '/templates/' +  settings.defaultTemplate +  '/layouts/layout'),
  partialsDir: path.join(__dirname, '/templates/' + settings.defaultTemplate + '/partials'),
  extname: '.hbs'
}); 

app.use(express.static(path.join(__dirname, 'public')));

app.engine('.hbs', hbsConfig.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/templates/' +  settings.defaultTemplate));

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(validator());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
i18n.configure({
  locales:['en', 'vi'],
  register: global,
  fallbacks: {'vi': 'en'},
  cookie: 'language',
  queryParamenter: 'lang',
  defaultLocate: 'en ',
  directory: __dirname + '/languages',
  directoryPermissions: '755',
  autoReload: true,
  updateFiles: true,
  api:{
    '__' : '__', //2 hàm dùng trong template.
    '__n': '__n'
  }
});

app.use(function(req, res, next) {
  i18n.init(req, res, next);
});  

//Sử dụng các khai báo bài 4
app.use(session({
  secret: settings.secured_key,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// end sử dụng ở bài 4

app.use(function(req, res, next)  {
  res.locals.clanguage = req.getLocale(); //Ngôn ngữ hiện tại
  res.locals.languages = i18n.getLocales(); //danh sách ngôn ngữ
  res.locals.settings  = settings;
  res.locals.logged    = req.isAuthenticated();
  res.locals.member    = req.user;
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/thanh-vien', routerMember);
app.use('/admin', routerBackend);
app.use('/api', apiRouter);
// catch 404 and forward to error handler

app.use(function(req, res, next) {
  res.send({url: req.originalUrl + ' not found'});
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
