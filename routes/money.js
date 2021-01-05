const express = require('express');
const router = express.Router();
const Block = require('../models/Block');
const Money = require('../models/Money');
const moment = require('moment');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

const today = moment().format('yyyy-MM-DD');

cron.schedule('30 * * * * *', () => {
    Money.find({}, (err, foundMoney) => {
        if(err){
            console.log(err);
        } else {
            foundMoney.forEach((money) => {
                if(money.dueDate === today){
                    console.log(money.dueDate)
                }
            });
        }
    });
});

router.post('/:id/new', function (req, res) {
    Block.findById(req.params.id, (err, foundBlock) => {
        if(err){
            console.log(err)
        } else {
            var newMoney = {
                name: req.body.name,
                dueDate: req.body.dueDate,
                ammount: req.body.ammount,
                income: foundBlock.income
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

router.put('/:id/paid', (req, res) => {
    Money.findById(req.params.id, (err, foundMoney) => {
        if(err){console.log(err)}
        foundMoney.paid = req.body.paid;
        foundMoney.save();
        res.redirect('back');
    })
})

router.delete('/:money_id/delete', (req, res) => {
    Money.findByIdAndDelete(req.params.money_id, (err) => {
        if(err){console.log(err)}
        res.redirect('back');
    });
});

module.exports = router;
