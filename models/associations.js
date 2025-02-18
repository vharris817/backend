const Customer = require('./Customer');
const WorkOrder = require('./WorkOrder');
const WorkOrderDetails = require('./WorkOrderDetails');

function applyAssociations(sequelize) {
  WorkOrder.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
  Customer.hasMany(WorkOrder, { foreignKey: 'customerId', as: 'workOrders' });

  WorkOrder.hasMany(WorkOrderDetails, { foreignKey: 'workOrderId', as: 'details' });
  WorkOrderDetails.belongsTo(WorkOrder, { foreignKey: 'workOrderId', as: 'workOrder' });
}


module.exports = applyAssociations;



  