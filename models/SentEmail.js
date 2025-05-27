const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SentEmail = sequelize.define('SentEmail', {
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  resumeFileName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastSent: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  uniqueKeys: {
    unique_email_resume: {
      fields: ['email', 'resumeFileName']
    }
  }
});

module.exports = SentEmail;