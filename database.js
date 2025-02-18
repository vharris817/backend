const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('workorders', 'postgres', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5433,
});

module.exports = sequelize;
