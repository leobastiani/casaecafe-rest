'use strict';


var mongoose = require('mongoose'),
  Payment = mongoose.model('Payments'),
  Product = mongoose.model('Products');

/*
Enum of possible errors
 */
var ERRORS = {
  FIELD_REQUIRED: 1,
  PRODUCT_NOT_FOUND: 2,
  PRODUCT_FIELDS_NOT_MATCH: 3,
  DISCOUNT_NOT_MATCH: 4,
  DISCOUNT_TOO_HIGH: 5,
  FIELD_WRONG_TYPE: 6,
  VALIDATOR: 7,
  UNKNOWN: 0
}

/*
Send error with Code and Msg
 */
var sendError = function (res, code, msg) {
  res.send({error: code, message: msg});
}

/*
Send error of type ERRORS.FIELD_REQUIRED
 */
var errorFieldRequired = function (res, field) {
  sendError(res, ERRORS.FIELD_REQUIRED, '"'+field+'" is required.');
}

/*
call if i dont know what this error is
 */
var sendUnknownError = function (res, err) {
  res.json({error: ERRORS.UNKNOWN, msg: 'Unknown error.', err: err});
}


/*
List all payments
route: GET /payments
 */
exports.list_all = function(req, res) {
  Payment.find({}, function (err, payment) {
    if(err) {
      res.send(err);
      return ;
    }
    res.json(payment);
  });
}


/*
Create a payment
route: POST /payments
 */
exports.create = function(req, res) {
  var params = req.body;

  var newPayment = new Payment(params);
  newPayment.getProduct(function (err, product) {
    // if there was an error
    if(err) {
      sendUnknownError(res, err);
      return ;
    }

    // check if this product exist
    if(product == null) {
      // this product does not exist
      sendError(res, ERRORS.PRODUCT_NOT_FOUND, 'Product "'+params['product']+'" not found.');
      return ;
    }
    
    // now, lets tests fields that must be
    // equal
    if(params['product_price'] != product['price']) {
      sendError(res, ERRORS.PRODUCT_FIELDS_NOT_MATCH, 'Price does not match respective product.');
      return ;
    }

    // check if this discount value represents its price
    var discountByPrice = (1 - newPayment['price'] / product['price']) * 100;
    // maximum error of discount margin
    var maxErroDiscount = 0.01;
    if(Math.abs(discountByPrice - newPayment['discount']) > maxErroDiscount) {
      sendError(res, ERRORS.DISCOUNT_NOT_MATCH, 'Discount does not match respective price.');
      return ;
    }

    // discount is up to 50%
    if(params['discount'] > 50) {
      sendError(res, ERRORS.DISCOUNT_TOO_HIGH, 'Discount is too high.');
      return ;
    }

    // now i can save
    newPayment.save(function(err, payment) {
      // if there was an error
      if (err) {

        // this for run once time
        for(var field in err['errors']) {
          // the error
          var error = err['errors'][field];

          if(error['kind'] == 'required') {
            // field required
            errorFieldRequired(res, error['path']);
            return ;
          }

          if(error['name'] == 'CastError') {
            // wrong type, like passing a number instead of a Date
            sendError(res, ERRORS.FIELD_WRONG_TYPE, '"'+field+'" must be '+error['kind']);
            return ;
          }

          if(error['name'] == 'ValidatorError') {
            // a validator error, like unknown payment_type
            sendError(res, ERRORS.VALIDATOR, error['message']);
            return ;
          }

        }

        // all other errors
        sendUnknownError(res, err);
        return ;
      }

      // send the new payment
      res.json(payment);

    });

  });


};
