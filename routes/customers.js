// backend/routes/customers.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer'); // Assuming you're using a model

// Fetch all customers
router.get('/', async (req, res) => {
  try {
    console.log("Fetching customers...");
    const customers = await Customer.findAll();
    console.log("Customers retrieved:", customers);
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new customer
router.post('/', async (req, res) => {
  try {
    const newCustomer = await Customer.create(req.body);
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

// Update a customer
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedCustomer = req.body;

  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    await customer.update(updatedCustomer);
    res.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Delete a customer
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    await customer.destroy();
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

module.exports = router;
