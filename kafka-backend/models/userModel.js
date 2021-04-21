const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userInfo = new Schema({
    fname:  {type: String, required: true}, 
    lname: {type: String, required: true},
    email:   {type: String, required: true, unique: true},
    password:   {type: String, required: true},
    phone: String,
    image: String,
    currency: String,
    language: String,
    timezone: String,
  });

  module.exports = mongoose.model('User',userInfo)