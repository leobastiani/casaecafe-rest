'use strict';
module.exports = function(app) {
  var payment = require('../controllers/paymentController');

  // route to get and insert payments
  app.route('/payments').
    get(payment.list_all).
    post(payment.create);

};
