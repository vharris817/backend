const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Ensure this points to your Sequelize instance

const WorkOrderDetails = sequelize.define('WorkOrderDetails', {
  partName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }, {
  tableName: 'workorderdetails', // ✅ Ensure lowercase table name
  timestamps: true
});

module.exports = WorkOrderDetails;
