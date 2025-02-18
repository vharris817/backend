const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer'); // Sequelize model
const WorkOrder = require('../models/WorkOrder'); // Sequelize model

// Dashboard summary endpoint
router.get('/', async (req, res) => {
  try {
    const totalCustomers = await Customer.count();
    const activeWorkOrders = await WorkOrder.count();
    res.status(200).json({
      customers: totalCustomers,
      workOrders: activeWorkOrders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
