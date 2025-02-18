const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Database Connection
const sequelize = require('./database');

// Import Models
const Customer = require('./models/Customer');
const WorkOrder = require('./models/WorkOrder');
const WorkOrderDetails = require('./models/WorkOrderDetails');

// Apply Associations AFTER model imports
const applyAssociations = require('./models/associations');
applyAssociations(); 

// Debug: Ensure models are loaded correctly
console.log('Registered models:', sequelize.models);
console.log('Associations for WorkOrder:', WorkOrder.associations);
console.log('Associations for WorkOrderDetails:', WorkOrderDetails.associations);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/customers', require('./routes/customers'));
app.use('/workorders', require('./routes/workorders'));
app.use('/dashboard', require('./routes/dashboard'));

// Test Route
app.get('/', (req, res) => {
  res.send('Work Order Tracking API is running!');
});

// Sync models and start server
sequelize
  .sync({ alter: false })
  .then(() => {
    console.log('Database schema updated.');
    app.listen(process.env.PORT || 3001, () => {
      console.log(`Server running on port ${process.env.PORT || 3001}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

