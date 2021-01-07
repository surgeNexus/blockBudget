const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const Block = require('../models/Block');

router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err){
            console.log(err);
        } else {
            res.render('settings', {
                user: foundUser
            });
        }
    });
});

module.exports = router;
