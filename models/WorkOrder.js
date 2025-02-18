const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const WorkOrder = sequelize.define('WorkOrder', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  workOrderNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' },
  dueDate: { type: DataTypes.DATE },
  customerId: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'WorkOrders',
  timestamps: true // ✅ Ensures `createdAt` and `updatedAt` are auto-handled
});

module.exports = WorkOrder;


