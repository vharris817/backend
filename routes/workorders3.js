const express = require('express');
const router = express.Router();
const WorkOrder = require('../models/WorkOrder');
const WorkOrderDetails = require('../models/WorkOrderDetails');
const Customer = require('../models/Customer');

// Function to generate a unique Work Order Number
const generateWorkOrderNumber = async () => {
  const lastWorkOrder = await WorkOrder.findOne({ order: [['id', 'DESC']] });

  let lastNumber = 1000; // Start from 1000 if no existing work orders

  if (lastWorkOrder && lastWorkOrder.workOrderNumber) {
    const parts = lastWorkOrder.workOrderNumber.split('-');
    lastNumber = !isNaN(parseInt(parts[1])) ? parseInt(parts[1]) : lastNumber;
  }

  return `WO-${lastNumber + 1}`;
};

// Create New Work Order
router.post('/', async (req, res) => {
  try {
    const { description, status, dueDate, customerId, details } = req.body;

    // Ensure a unique Work Order Number is generated
    const workOrderNumber = await generateWorkOrderNumber();

    // Create the work order
    const newWorkOrder = await WorkOrder.create({
      workOrderNumber,
      description,
      status: status || 'Pending',
      dueDate,
      customerId,
    });

    // Add associated details (if any)
    if (details && Array.isArray(details)) {
      await WorkOrderDetails.bulkCreate(
        details.map((detail) => ({
          ...detail,
          workOrderId: newWorkOrder.id,
        }))
      );
    }

    res.status(201).json(newWorkOrder);
  } catch (error) {
    console.error('Error creating work order:', error);
    res.status(500).json({ message: 'Error creating work order', error: error.message });
  }
});

module.exports = router;

