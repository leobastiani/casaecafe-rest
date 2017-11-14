'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var PaymentsSchema = new Schema({
  /*
  all fields are required
   */
  payment_date: {
    type: Date,
    required: true
  },
  payment_type: {
    type: String,
    enum: ['cartao de debito', 'cartao de credito', 'boleto bancario', 'debito online', 'cartao internacional'],
    required: true
  },
  product: {
    type: String,
    required: true
  },
  product_price: {
    type: String,
    required: true
  },
  discount: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  transaction_id: {
    // it could be another type
    type: String,
    required: true
  }
});

PaymentsSchema.methods.getProduct = function (cb) {
  this.model('Products').findOne({product: this.product}, cb);
}


module.exports = mongoose.model('Payments', PaymentsSchema);