const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  name: {type: String , required:true},
  contact: {type: String , required:true},
  nic: {type: String , required:true},
  email: {type: String , required:true, unique:true} ,
  password: {type: String , required:true},
  role: {type: String , required:true},
  dateTime: {type: Date, default: Date.now , required:true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User',userSchema);
