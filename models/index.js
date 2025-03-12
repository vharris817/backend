const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database"); // Import DB connection

const Customer = require("./Customer")(sequelize, DataTypes);
const User = require("./User")(sequelize, DataTypes);
const WorkOrder = require("./WorkOrder")(sequelize, DataTypes);
const WorkOrderDetails = require("./WorkOrderDetails")(sequelize, DataTypes);

// Associations
WorkOrder.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });
WorkOrder.hasMany(WorkOrderDetails, { foreignKey: "workOrderId", as: "details" });

WorkOrderDetails.belongsTo(WorkOrder, { foreignKey: "workOrderId", as: "workOrder" });

// Export models
module.exports = { sequelize, Customer, User, WorkOrder, WorkOrderDetails };
