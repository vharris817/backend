const express = require('express');
const router = express.Router();
const WorkOrder = require('../models/WorkOrder');
const Customer = require('../models/Customer');
const WorkOrderDetails = require('../models/WorkOrderDetails');

// ✅ FIXED: Generate Work Order Number Safely
const generateWorkOrderNumber = async () => {
  try {
    const lastWorkOrder = await WorkOrder.findOne({ order: [['id', 'DESC']] });

    let lastNumber = 1000; // Default if no work orders exist

    if (lastWorkOrder?.workOrderNumber) {
      const parts = lastWorkOrder.workOrderNumber.split('-');
      const parsedNumber = parseInt(parts[1]);

      // Ensure parsed number is valid
      if (!isNaN(parsedNumber)) {
        lastNumber = parsedNumber;
      }
    }

    const newWorkOrderNumber = `WO-${lastNumber + 1}`;
    console.log(`✅ Generated Work Order Number: ${newWorkOrderNumber}`);
    return newWorkOrderNumber;
  } catch (error) {
    console.error('❌ Error generating work order number:', error);
    return `WO-${Math.floor(1000 + Math.random() * 9000)}`; // Fallback random WO number
  }
};

// ✅ Fetch All Work Orders
router.get('/', async (req, res) => {
  try {
    const { status, customerId, sortBy, order } = req.query; // Get filter & sort params

    let whereClause = {}; // Build filter conditions

    if (status) {
      whereClause.status = status; // Filter by status
    }
    if (customerId) {
      whereClause.customerId = customerId; // Filter by customer
    }

    // Default sorting (by createdAt if none specified)
    let orderClause = [['createdAt', 'DESC']];
    if (sortBy) {
      const validSortFields = ['status', 'dueDate', 'customerId'];
      if (validSortFields.includes(sortBy)) {
        orderClause = [[sortBy, order === 'ASC' ? 'ASC' : 'DESC']];
      }
    }

    const workOrders = await WorkOrder.findAll({
      where: whereClause,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'email', 'phone'],
        },
        {
          model: WorkOrderDetails,
          as: 'details',
        },
      ],
      order: orderClause,
    });

    res.json(workOrders);
  } catch (error) {
    console.error('Error fetching work orders:', error);
    res.status(500).json({ error: error.message });
  }
});


// ✅ Create New Work Order
router.post('/', async (req, res) => {
  try {
    const { description, status, dueDate, customerId, details } = req.body;

    // ✅ Validate required fields
    if (!description || !dueDate || !customerId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // ✅ Prevent duplicate work orders (same description & customer)
    const existingWorkOrder = await WorkOrder.findOne({ 
      where: { description, customerId }
    });
    if (existingWorkOrder) {
      return res.status(409).json({ error: 'Duplicate work order found for this customer' });
    }

    // ✅ Generate a unique Work Order Number
    const workOrderNumber = await generateWorkOrderNumber();
    console.log(`✅ Generated Work Order Number: ${workOrderNumber}`);

    // ✅ Create the work order
    const newWorkOrder = await WorkOrder.create({
      workOrderNumber,
      description,
      status: status || 'Pending',
      dueDate,
      customerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`✅ Work Order Created:`, newWorkOrder);

    // If there are details, create them separately and link them to the work order
    if (details && Array.isArray(details)) {
      await Promise.all(details.map(async (detail) => {
        await WorkOrderDetails.create({
          partName: detail.partName,
          quantity: detail.quantity,
          price: detail.price,
          workOrderId: workOrder.id, // Associate with the created work order
        });
      }));
    }

    res.status(201).json(workOrder);
  } catch (error) {
    console.error('Error creating work order:', error);
    res.status(500).json({ error: 'Error creating work order' });
  }
});


// ✅ Update an Existing Work Order
router.put('/:id', async (req, res) => {
  try {
    const workOrderId = req.params.id;
    const { description, status, dueDate, customerId, details } = req.body;

    // Update the work order
    const workOrder = await WorkOrder.findByPk(workOrderId);
    if (!workOrder) {
      return res.status(404).json({ error: 'WorkOrder not found' });
    }
    await workOrder.update({ description, status, dueDate, customerId });

    // Delete existing details and insert new ones (or update accordingly)
    await WorkOrderDetails.destroy({ where: { workOrderId } });

    if (details && Array.isArray(details)) {
      await Promise.all(details.map(async (detail) => {
        await WorkOrderDetails.create({
          partName: detail.partName,
          quantity: detail.quantity,
          price: detail.price,
          workOrderId: workOrder.id,
        });
      }));
    }

    res.status(200).json({ message: 'Work Order updated successfully' });
  } catch (error) {
    console.error('Error updating work order:', error);
    res.status(500).json({ error: 'Error updating work order' });
  }
});


module.exports = router;


