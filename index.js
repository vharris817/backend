const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const authRoutes = require("./routes/auth"); // Import authentication routes
const sequelize = require('./database');
const applyAssociations = require('./models/associations');

// Load environment variables
dotenv.config();

const app = express();

// ✅ Security Middleware (Proper Order)
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

// ✅ Fix: Allow Scripts in Content Security Policy (CSP)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' https://backend-ejw6.onrender.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: blob:;"
  );
  next();
});

// ✅ Database Connection & Debugging
console.log('Connecting to database:', {
  host: process.env.DB_HOST || 'dpg-cuqug0l2ng1s73fbdg70-a.oregon-postgres.render.com',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'workorders_qpn0',
  username: process.env.DB_USER || 'vharris',
});

sequelize
  .sync()
  .then(() => console.log('✅ Database synced successfully'))
  .catch(err => console.error('❌ Error syncing database:', err));

// ✅ Import Models & Apply Associations
const Customer = require('./models/Customer');
const WorkOrder = require('./models/WorkOrder');
const WorkOrderDetails = require('./models/WorkOrderDetails');
applyAssociations();

// Debugging
console.log('Registered models:', sequelize.models);
console.log('Associations for WorkOrder:', WorkOrder.associations);
console.log('Associations for WorkOrderDetails:', WorkOrderDetails.associations);

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Mount Routes
app.use('/auth', authRoutes); // Authentication routes
app.use('/customers', require('./routes/customers'));
app.use('/workorders', require('./routes/workorders'));
app.use('/dashboard', require('./routes/dashboard'));

// ✅ Fix: Corrected Work Order Lookup Route
app.get("/workorders/:workOrderNumber", async (req, res) => {
  try {
    const { workOrderNumber } = req.params;
    const workOrder = await WorkOrder.findOne({ where: { workOrderNumber } });

    if (!workOrder) {
      return res.status(404).json({ error: "Work Order not found" });
    }

    res.json(workOrder);
  } catch (error) {
    console.error("Error fetching work order:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Use Render's Dynamic Port (Fix for Deployment)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});



