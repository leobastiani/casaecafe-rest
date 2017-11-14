'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProductsSchema = new Schema({
  product: {
    type: String,
    required: '"product" is required.'
  },
  price: {
    type: String,
    required: '"price" is required.'
  },
  description: {
    type: String,
    required: '"description" is required.'
  }
});



module.exports = mongoose.model('Products', ProductsSchema);