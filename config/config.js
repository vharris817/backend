const { Sequelize } = require('sequelize');

// Set the environment (default to 'production')
const env = process.env.NODE_ENV || 'production';

// Load the configuration for the current environment
const config = require('./config.js')[env];

// Log the configuration being used
console.log('Initializing Sequelize with config:', config);

// Initialize Sequelize
const sequelize = new Sequelize(config);

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

// Export the Sequelize instance for use in other parts of the application
module.exports = sequelize;
