var mongoose = require('mongoose');

var MoneySchema = new mongoose.Schema({
  name: String,
  ammount: Number,
  dueDate: String,
  moneyType: String,
  paid: { type: Boolean, default: false },
  authorId: String
});

module.exports = mongoose.model('Money', MoneySchema);
