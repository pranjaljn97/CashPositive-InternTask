var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  subject : String,
  content : String,
  touser: String,
  byuser: String
});

module.exports = mongoose.model('Message', MessageSchema);
