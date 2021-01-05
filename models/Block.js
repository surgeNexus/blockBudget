var mongoose = require('mongoose');

var BlockSchema = new mongoose.Schema({
    name: String,
    income: { type: Boolean, default: false },
    authorId: String,
    monies: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Blocks"
        }
    ],
})

module.exports = mongoose.model('Blocks', BlockSchema);
