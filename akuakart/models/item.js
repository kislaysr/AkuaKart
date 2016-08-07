var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = mongoose.Schema({
  title : String,
  cost : Number,
  ratings : [{
      user : {type : Schema.Types.ObjectId, ref: 'User'},
      stars : Number
  }],
  seller : {type : Schema.Types.ObjectId, ref: 'User'},
  dateCreated : Date,
  tags : [String],
  description : String,
  category : String,
  subcategory : String
});

module.exports = mongoose.model('Item', itemSchema);
