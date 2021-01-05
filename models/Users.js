var mongoose = require('mongoose'),
  passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  blocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blocks"
    }
  ],
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Users', UserSchema);
