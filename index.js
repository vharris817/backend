const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

console.log('Connecting to database:', {
  host: process.env.DB_HOST || 'dpg-cuqug0l2ng1s73fbdg70-a.oregon-postgres.render.com',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'workorders_qpn0',
  username: process.env.DB_USER || 'vharris',
});

// Database Connection
const sequelize = require('./database');
sequelize
  .sync()
  .then(() => {
    console.log('✅ Database synced successfully');
  })
  .catch(err => {
    console.error('❌ Error syncing database:', err);
  });

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

// **Fix: Use Render's PORT variable**
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


