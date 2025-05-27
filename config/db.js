const { Sequelize } = require('sequelize');
const path = require('path');
const { logger } = require('../utils/logger');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH || './db/database.sqlite',
 logging: msg => logger.debug(msg)
});

module.exports = sequelize;