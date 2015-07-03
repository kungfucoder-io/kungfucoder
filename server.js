var express = require('express')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , bodyParser = require('body-parser')
  , nunjucks = require('nunjucks')
  , passport = require('passport')
  , config = require('./config.json')
  , database = require('./database')
  , routes = require('./routes')(database)
  , server = express();
;

server.set('port', process.env.PORT || 3000);

server.use(logger());

server.use(cookieParser('secret'));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json({ limit: '25mb' }));

require('./passport')(passport);

server.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

nunjucks.configure('views', {
  autoescape: true,
  express: server
});

server.use(passport.initialize());
server.use(passport.session());

server.enable('trust proxy');

function checkAuthorization (req, res, next) {
  if (req.isAuthenticated && req.user.id) return next();
  else res.status(401).send("Unauthorized request!");
}

// User Routes =================================================================

server.get('/users/:username/',
  function (req, res, next) {
    return next();
  }, routes.getUser)
;

server.get('/users/:username/posts/',
  function (req, res, next) {
    return next();
  }, routes.getUserPosts)
;

server.get('/users/:username/posts/:post/',
  function (req, res, next) {
    return next();
  }, routes.getUserPost)
;

server.post('/users/',
  passport.authenticate('register'),
  function (req, res, next) {
    res.status(201).send(req.user);
  })
;

server.put('/users/:username/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.updateUser)
;

server.put('/users/:username/preferences/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.updateUserPreferences)
;

server.delete('/users/:username/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.deleteUser)
;

// Jobs Postings Routes ========================================================

server.get('/classifieds/',
  function (req, res, next) {
    return next();
  }, routes.getClassifieds)
;

server.get('/classifieds/:classified/',
  function (req, res, next) {
    return next();
  }, routes.getClassified)
;

server.post('/classifieds/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.createClassified)
;

server.put('/classifieds/:classified/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.updateClassified)
;

server.delete('/classifieds/:classified/',
  checkAuthorization,
  function (req, res, next) {
    return next();
  }, routes.deleteClassified)
;

// Public Routes ===============================================================
server.use('/css', express.static(__dirname + '/public/dist/css/'));
server.use('/js', express.static(__dirname + '/public/dist/js/'));
server.use('/assets', express.static(__dirname + '/public/assets/'));

server.post('/login/',
  passport.authenticate('login'),
  function (req, res, next) {
    res.status(200).send(req.user);
  })
;

server.post('/logout/',
  checkAuthorization,
  function (req, res, next) {
    req.logout();
    res.status(200).end();
  })
;

server.get('/', function (req, res) {
  res.render('home.html');
});

module.exports = function (callback) { callback(server); };