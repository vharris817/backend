module.exports = {
    production: {
      username: process.env.DB_USER || 'vharris',
      password: process.env.DB_PASSWORD || 'G7Vfiqmo10bO0B7DZXYt9JpWo8L9vMT6',
      database: process.env.DB_NAME || 'workorders_qpn0',
      host: process.env.DB_HOST || 'dpg-cuqug0l2ng1s73fbdg70-a.oregon-postgres.render.com',
      dialect: 'postgres',
      port: process.env.DB_PORT || 5432,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Important for Render PostgreSQL
        },
      },
    },
  };
  