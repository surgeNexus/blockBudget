var mongoose = require('mongoose');

var MoneySchema = new mongoose.Schema({
  name: String,
  ammount: String,
  dueDate: String,
  income: { type: Boolean, default: false },
  paid: { type: Boolean, default: false },
});

module.exports = mongoose.model('Money', MoneySchema);
