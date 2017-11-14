var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),

  // Models
  Prodcut = require('./api/models/productModel'),
  Payment = require('./api/models/paymentModel'),

  bodyParser = require('body-parser');
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/casaecafe'); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Routes
var productRoutes = require('./api/routes/productRoutes'); //importing route
productRoutes(app); //register the route
var paymentRoutes = require('./api/routes/paymentRoutes'); //importing route
paymentRoutes(app); //register the route

// middleware page not found
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});


app.listen(port);
console.log('Casaecafe RESTful API server started on: ' + port);