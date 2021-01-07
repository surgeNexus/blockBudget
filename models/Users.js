var mongoose = require('mongoose'),
  passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  alert: {type: Boolean, default: false},
  alertDays: Number,
  email2: String,
  email3: String,
  blocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blocks"
    }
  ],
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Users', UserSchema);
