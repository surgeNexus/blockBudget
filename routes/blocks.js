const express = require('express');
const router = express.Router();
const middleware = require('../middleware/index');
const User = require('../models/Users');
const Block = require('../models/Block');

router.post('/:id/new',middleware.checkProfileOwnership, function (req, res) {
  User.findById(req.params.id, (err, foundUser) => {
      if(err){
          console.log(err);
      } else {
          var newBlock = {
              name: req.body.name,
              moneyType: req.body.moneyType,
              authorId: foundUser.id
          }
          Block.create(newBlock, (err, block) => {
              if(err){
                  console.log(err)
              } else {
                  foundUser.blocks.push(block);
                  foundUser.save();
                  res.redirect('back');
              }
          })
      }
  })
});

router.delete('/:block_id/delete', middleware.checkProfileOwnership, (req, res) => {
    Block.findByIdAndDelete(req.params.block_id, (err) => {
        if(err){console.log(err)}
        res.redirect('back');
    })
})

module.exports = router;
