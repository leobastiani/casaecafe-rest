'use strict';


var mongoose = require('mongoose'),
  Product = mongoose.model('Products');

/*
list all products
or
list all plans
 */
exports.list_all = function(req, res) {

  // do not show fields _id and __v
  Product.find({}, {'_id': 0, '__v': 0}, function(err, product) {

    if (err) {
      // if an error occurs
      res.send(err);
      return ;
    }

    res.json(product);
  });

};
