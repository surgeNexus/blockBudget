const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const Block = require('../models/Block');
const Money = require('../models/Money');

router.get('/', function (req, res) {
  res.render('index');
});

router.get('/dashboard', (req, res) => {
  if(req.user){
    res.redirect('/dashboard/' + req.user.id);
  } else {
    res.redirect('/auth/login');
  }
})

router.get('/dashboard/:id', (req, res) => {
  User.findById(req.params.id)
  .populate({
    path: 'blocks',
    populate: {
      model: Money,
      path: 'monies',
      options: {
        sort: ({ dueDate: 'asc' })
      }
    },
  })
  .exec((err, foundUser) => {
    if(err){
      console.log(err);
    } else {
      res.render('dashboard', {
        user: foundUser
      });
    }
  })
})

module.exports = router;
