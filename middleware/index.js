var User = require('../models/Users');

// ALL MIDDLEWARE GOES HERE

var middlewareObj = {};

middlewareObj.checkProfileOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    User.findById(req.params.id, function (err, foundUser) {
      if (err || !foundUser) {
        req.flash('error', 'User not found');
        res.redirect('/');
      } else {
        // does user own the comment?
        if (foundUser._id.equals(req.user.id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please Log In First!');
  res.redirect('/auth/login');
};

module.exports = middlewareObj;
