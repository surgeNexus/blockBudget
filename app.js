var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  methodOverride = require('method-override'),
  flash = require('connect-flash'),
  moment = require('moment'),
  User = require('./models/Users');

var dotenv = require('dotenv');
dotenv.config();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/budget');

var indexRoutes = require('./routes/index');
var authRoutes = require('./routes/auth');
var blockRoutes = require('./routes/blocks');
var moneyRoutes = require('./routes/money');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
//moment configuration
app.locals.moment = require('moment');
// PASSPORT CONFIGURATION
app.use(
  require('express-session')({
    secret: 'Once again Star wins cutest dog!',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(indexRoutes);
app.use('/auth', authRoutes);
app.use('/blocks', blockRoutes);
app.use('/money', moneyRoutes);

app.listen(3000, function () {
  console.log('Do your bills!');
});
