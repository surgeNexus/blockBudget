const express = require('express');
const router = express.Router();
const middleware = require('../middleware/index');
const moment = require('moment');
const cron = require('node-cron');
const User = require('../models/Users');
const Block = require('../models/Block');
const Money = require('../models/Money');

router.get('/', function (req, res) {
  res.render('index');
});

router.get('/dashboard', (req, res) => {
  if(req.user && middleware.isLoggedIn){
    res.redirect('/dashboard/' + req.user.id);
  } else {
    res.redirect('/auth/login');
  }
})

router.get('/dashboard/:id', middleware.isLoggedIn, (req, res) => {
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
      foundUser.blocks.forEach((block) => {
        Block.findById(block.id, (err, foundBlock) => {
          if(err){console.log(err)}
          var totals = 0;
          foundBlock.monies.forEach((money) => {
            totals = totals + money.ammount
          });
          foundBlock.total = totals;
          block.save();
        });
      });
      res.render('dashboard', {
        user: foundUser
      });
    }
  });
});

cron.schedule('* * 1 * *', () => {
  Money.find({}, (err, foundMoney) => {
    if(err){
      console.log(err);
    } else {
      foundMoney.forEach((moneyA) => {
        Money.findById(moneyA.id, (err, money) => {
          if(err){
            console.log(err);
          } else if(money.paid === true){
            money.dueDate = moment(money.dueDate).add(1, 'M').format('yyyy-MM-DD');
            money.paid = false;
            money.save();
          }
        })
      })
    }
  })
});
  

module.exports = router;
