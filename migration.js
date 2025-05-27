// models/migrate.js
const sequelize = require('./config/db.js');
const SentEmail = require('./models/SentEmail.js');

async function migrate() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();