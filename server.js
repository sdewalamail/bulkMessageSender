const express = require('express');
const fileUpload = require('express-fileupload');
const emailRoutes = require('./routes/emailRoutes');
const { logger } = require('./utils/logger');
const sequelize = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(fileUpload());
app.use(express.json());

// Routes
app.use('/api', emailRoutes);

// Database connection and server start
const PORT = process.env.PORT || 3000;

async function initializeServer() {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    // Sync database models
    await sequelize.sync();
    logger.info('Database synchronized');

    // Initialize queue after DB connection
    const { emailQueue } = require('./queues/emailQueue');
    
    // Start server
    app.listen(PORT, () => { logger.info(`Server running on port ${PORT}`) });
    
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

initializeServer();