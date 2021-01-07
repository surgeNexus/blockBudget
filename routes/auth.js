const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/Users');


router.get('/login', function (req, res) {
  res.render('auth/index');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: 'Welcome Back!'
  }),
  function (req, res) {}
);

// logout route
router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success', 'Logged you out!');
  res.redirect('/');
});

router.get('/register', (req, res) => {
    res.render('auth/register');
})

router.post('/register', function (req, res) {
    if (!req.files && req.body.password === req.body.password2) {
      var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });
      User.register(newUser, req.body.password, function (err, user) {
        if (err) {
          console.log(err.message);
          return res.render('auth/register', { error: err.message });
        }
        passport.authenticate('local')(req, res, function () {
          res.redirect('/');
        });
      });
    } else {
      req.flash('error', 'Your passwords do not match');
      res.redirect('back');
    }
  });

module.exports = router;
