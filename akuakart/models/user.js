var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
  username : String,
  password : String,
  email : String,
  lastLoggedIn : Date,
  seller : {
      address : String,
      phone : String,
      items : [{type : Schema.Types.ObjectId, ref : 'Item'}],
      alias : String,
      ratings : [{
          user : {type : Schema.Types.ObjectId, ref : 'User'},
          stars : {type : Number, default : 0}
      }]
  },
  isSeller : {type : Boolean, default: false}
});

module.exports = mongoose.model('User', userSchema);
