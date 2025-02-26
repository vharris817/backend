const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: DataTypes.STRING,
  address: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  vehicleVIN: DataTypes.STRING,
  mileage: DataTypes.INTEGER,
  licensePlate: DataTypes.STRING
}, {
  tableName: 'customers', // ✅ Ensure lowercase table name
  timestamps: true
});

module.exports = Customer;
