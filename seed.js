var seeder = require('mongoose-seed');
 
// Connect to MongoDB via Mongoose
seeder.connect('mongodb://localhost/casaecafe', function() {
 
  // Load Mongoose models
  seeder.loadModels([
    './api/models/productModel.js',
    './api/models/paymentModel.js'
  ]);
 
  // Clear specified collections
  seeder.clearModels(['Payments', 'Products'], function() {
 
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function() {
      seeder.disconnect();
    });
 
  });


});
 
// Data array containing seed data - documents organized by Model
var data = [
    {
        'model': 'Products',
        'documents': [
            {
                'product': 'gold_plan',
                'price': 59.90,
                'description': 'plano pago gold'
            },
            {
                'product': 'platinum_plan',
                'price': 79.90,
                'description': 'premium platinum'
            },
            {
                'product': 'super_premium_plan',
                'price': 129.90,
                'description': 'o melhor plano de todos'
            }
        ]
    }
];