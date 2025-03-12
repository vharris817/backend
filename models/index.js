const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database"); // Import DB connection

const Customer = require("./Customer");
const User = require("./User");
const WorkOrder = require("./WorkOrder");
const WorkOrderDetails = require("./WorkOrderDetails");

// Initialize models with sequelize
Customer.init(sequelize);
User.init(sequelize);
WorkOrder.init(sequelize);
WorkOrderDetails.init(sequelize);

// Associations
WorkOrder.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });
WorkOrder.hasMany(WorkOrderDetails, { foreignKey: "workOrderId", as: "details" });

WorkOrderDetails.belongsTo(WorkOrder, { foreignKey: "workOrderId", as: "workOrder" });

// Export models
module.exports = { sequelize, Customer, User, WorkOrder, WorkOrderDetails };

