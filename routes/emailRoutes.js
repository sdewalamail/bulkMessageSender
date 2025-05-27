const express = require('express');
const { sendBulkEmails } = require('../controllers/emailController');
const router = express.Router();

router.post('/send_emails', sendBulkEmails);
module.exports = router;