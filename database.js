const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables

const sequelize = new Sequelize(process.env.DB_NAME || 'workorders_qpn0', process.env.DB_USER || 'vharris', process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || 'dpg-cuqug0l2ng1s73fbdg70-a.oregon-postgres.render.com',
  dialect: 'postgres',
  port: process.env.DB_PORT || 5432,
  logging: false, // Reduce noise in logs
  dialectOptions: {
    ssl: {
      require: true, // ✅ Ensure SSL is required
      rejectUnauthorized: false // ✅ Prevent self-signed certificate rejection
    }
  }
});

sequelize
  .authenticate()
  .then(() => console.log('✅ Database connection established successfully!'))
  .catch(err => console.error('❌ Database connection error:', err));

module.exports = sequelize;
