'use strict';
module.exports = function(app) {
  var product = require('../controllers/productController');

  // route to list all plans
  app.route('/plans').get(product.list_all);

};
