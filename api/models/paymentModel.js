'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PaymentsSchema = new Schema({
  payment_date: {
    type: Date,
    required: '"payment_date" is required.'
  },
  payment_type: {
    type: String,
    enum: ['cartao de debito', 'cartao de credito', 'boleto bancario', 'debito online', 'cartao internacional'],
    required: '"payment_type" is required.'
  },
  product: {
    type: String,
    required: '"product" is required.'
  },
  product_price: {
    type: String,
    required: '"product_price" is required.'
  },
  discount: {
    type: String,
    required: '"discount" is required.'
  },
  price: {
    type: Number,
    required: '"price" is required.'
  },
  transaction_id: {
    type: String,
    required: '"transaction_id" is required.'
  }
});

PaymentsSchema.methods.getProduct = function (cb) {
  this.model('Products').findOne({product: this.product}, cb);
}


module.exports = mongoose.model('Payments', PaymentsSchema);