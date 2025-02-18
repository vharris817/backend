const sequelize = require('./database');
const Customer = require('./models/Customer');

sequelize.sync({ force: true })  // Sync the database (this will drop and recreate tables)
  .then(async () => {
    // Seed the database with initial data
    await Customer.create({ name: 'John Doe', address: '123 Main St' });
    await Customer.create({ name: 'Jane Doe', address: '133 Main St' });

    console.log('Database seeded!');

    // Close the process after seeding is done
    process.exit();
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
    process.exit(1);  // Exit with error code if syncing fails
  });
