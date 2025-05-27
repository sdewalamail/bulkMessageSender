const Queue = require('bull');
const nodemailer = require('nodemailer');
const SentEmail = require('../models/SentEmail');
const moment = require('moment');
const { logger } = require('../utils/logger');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const emailQueue = new Queue('email-queue', process.env.REDIS_URL || 'redis://localhost:6379');

emailQueue.process(5, async (job) => {
  try {
    const { company, resumePath, resumeFileName } = job.data;
    
    // Check if email was sent within last month
    const existing = await SentEmail.findOne({
      where: {
        email: company.email,
        resumeFileName
      }
    });

    if (existing && moment().diff(moment(existing.lastSent), 'months') < 1) {
      logger.warn(`Skipping ${company.email} - already sent within 1 month`);
      return;
    }

    // Prepare email
    const mailOptions = {
      from: `Your Name <${process.env.EMAIL_USER}>`,
      to: company.email,
      subject: 'Job Application - Resume Attached',
      text: `Dear ${company.name},\n\nPlease find my resume attached for your consideration.\n\nBest regards,\nYour Name`,
      attachments: [{
        filename: 'resume.pdf',
        path: resumePath
      }]
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    // Update database
    await SentEmail.upsert({
      email: company.email,
      resumeFileName,
      lastSent: new Date()
    });

    logger.info(`Email sent to ${company.email}`);
  } catch (error) {
    logger.error(`Email failed to ${company.email}: ${error.message}`);
    throw error;
  }
});

module.exports = { emailQueue };