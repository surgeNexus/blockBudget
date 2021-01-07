var mongoose = require('mongoose');

var BlockSchema = new mongoose.Schema({
    name: String,
    moneyType: String,
    authorId: String,
    monies: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Blocks"
        }
    ],
    total: Number
})

module.exports = mongoose.model('Blocks', BlockSchema);
