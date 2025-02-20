const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'dpg-cuqug0l2ng1s73fbdg70-a.oregon-postgres.render.com',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'workorders_qpn0',
  username: process.env.DB_USER || 'vharris',
  password: process.env.DB_PASSWORD || 'G7Vfiqmo10bO0B7DZXYt9JpWo8L9vMT6',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Important for Render PostgreSQL
    },
  },
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();
