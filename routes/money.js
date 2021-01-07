const express = require('express');
const router = express.Router();
const middleware = require('../middleware/index');
const Block = require('../models/Block');
const Money = require('../models/Money');
const User = require('../models/Users');
const moment = require('moment');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

const today = moment().format('yyyy-MM-DD');

cron.schedule('* 9 * * *', () => {
    User.find({})
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
            foundUser.forEach((user) => {
                user.blocks.forEach((block) => {
                    block.monies.forEach((money) => {
                        if(money.dueDate === today && income === 'outgoing' && paid === false){
                            var smtpTransport = nodemailer.createTransport({
                                service: 'Gmail',
                                auth: {
                                  user: process.env.GMAILUSER,
                                  pass: process.env.GMAILPW
                                }
                            });
                            var mailOptions = {
                              to: user.username,
                              from: 'surgenexus.app@gmail.com',
                              subject:
                                'BUDGET',
                              text:
                                'Your bill ' +
                                money.name.toUpperCase() +
                                ' is due today in the amount of' + 
                                money.ammount + '.'
                            };
                            smtpTransport.sendMail(mailOptions, function (err) {
                                if(err){
                                    console.log(err);
                                }
                            });
                        }
                    })
                })
            });
        }
    });
});

router.post('/:id/new', middleware.checkProfileOwnership, function (req, res) {
    Block.findById(req.params.id, (err, foundBlock) => {
        if(err){
            console.log(err)
        } else {
            var newMoney = {
                name: req.body.name,
                dueDate: req.body.dueDate,
                ammount: req.body.ammount,
                moneyType: foundBlock.moneyType
            }
            Money.create(newMoney, (err, money) => {
                if(err){
                    console.log(err);
                } else {
                    foundBlock.monies.push(money);
                    foundBlock.save();
                    res.redirect('back');
                }
            })
        }
    });
});

router.put('/:id/paid', middleware.checkProfileOwnership, (req, res) => {
    Money.findById(req.params.id, (err, foundMoney) => {
        if(err){console.log(err)}
        foundMoney.paid = req.body.paid;
        foundMoney.save();
        res.redirect('back');
    });
});

router.delete('/:money_id/delete', middleware.checkProfileOwnership, (req, res) => {
    Money.findByIdAndDelete(req.params.money_id, (err) => {
        if(err){console.log(err)}
        res.redirect('back');
    });
});

module.exports = router;
