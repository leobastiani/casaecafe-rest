'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProductsSchema = new Schema({
  /*
  all fields are required
   */
  product: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});



module.exports = mongoose.model('Products', ProductsSchema);