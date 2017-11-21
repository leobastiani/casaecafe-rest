'use strict';


var mongoose = require('mongoose'),
    Product = mongoose.model('Products'),
    Payment = mongoose.model('Payments'),
    ejs = require('ejs');

/*
list all products
or
list all plans
 */
exports.view = function(req, res) {

    Product.find({}, function (err, product) {
        ejs.renderFile('api/views/index.ejs', { plans: product, payment_types: Payment.schema.obj.payment_type.enum }, function(err, data) {
            res.send(err || data);
        });
    });

};
