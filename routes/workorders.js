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
          attributes: ['id', 'name', 'address', 'email', 'phone'],
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

    // ✅ Generate a unique Work Order Number
    const workOrderNumber = await generateWorkOrderNumber();

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

    // ✅ Save WorkOrderDetails and link them to the new WorkOrder
    if (details && Array.isArray(details)) {
      const detailsData = details.map((detail) => ({
        partName: detail.partName,
        quantity: detail.quantity,
        price: detail.price,
        total: (detail.quantity || 0) * (detail.price || 0), // ✅ Ensure total is calculated
        workOrderId: newWorkOrder.id, // Link to WorkOrder
      }));
      await WorkOrderDetails.bulkCreate(detailsData);
    }

    // ✅ Fetch and return the newly created work order with its details
    const createdWorkOrder = await WorkOrder.findOne({
      where: { id: newWorkOrder.id },
      include: [{ model: WorkOrderDetails, as: 'details' }],
    });

    res.status(201).json(createdWorkOrder);
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

    // Find the existing work order
    const workOrder = await WorkOrder.findByPk(workOrderId);
    if (!workOrder) {
      return res.status(404).json({ error: 'WorkOrder not found' });
    }

    // ✅ Update WorkOrder fields
    await workOrder.update({ description, status, dueDate, customerId });

    // ✅ Update WorkOrderDetails:
    // - Delete existing details
    await WorkOrderDetails.destroy({ where: { workOrderId } });

    // - Insert updated details
    if (details && Array.isArray(details)) {
      const detailsData = details.map((detail) => ({
        partName: detail.partName,
        quantity: detail.quantity,
        price: detail.price,
        total: (detail.quantity || 0) * (detail.price || 0), // ✅ Ensure total is calculated
        workOrderId: workOrder.id,
      }));
      await WorkOrderDetails.bulkCreate(detailsData);
    }

    // ✅ Fetch and return the updated work order with its details
    const updatedWorkOrder = await WorkOrder.findOne({
      where: { id: workOrder.id },
      include: [{ model: WorkOrderDetails, as: 'details' }],
    });

    res.status(200).json(updatedWorkOrder);
  } catch (error) {
    console.error('Error updating work order:', error);
    res.status(500).json({ error: 'Error updating work order' });
  }
});


module.exports = router;


