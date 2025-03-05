const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// ✅ Fix: Allow scripts in Content Security Policy (CSP)
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self' https://backend-ejw6.onrender.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: blob:;");
  next();
});

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
app.get("/:workOrderNumber", async (req, res) => {
  try {
    const { workOrderNumber } = req.params;
    const workOrder = await db.WorkOrders.findOne({ where: { workOrderNumber } });

    if (!workOrder) {
      return res.status(404).json({ error: "Work Order not found" });
    }

    res.json(workOrder);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// **Fix: Use Render's PORT variable**
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const helmet = require('helmet');

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);



