const { processExcel } = require('../utils/excelParser');
const { saveFiles } = require('../utils/fileStorage');
const { emailQueue } = require('../queues/emailQueue');
const { logger } = require('../utils/logger');

exports.sendBulkEmails = async (req, res) => {
  try {
    if (!req.files?.resume || !req.files?.companies) {
      return res.status(400).json({ error: 'Both resume and companies file are required' });
    }

    // Save files with validation
    const { resumePath, resumeFileName, excelPath, resumeIsNew, excelIsNew } = await saveFiles( req.files.resume, req.files.companies);
    // if(!resumePath || !excelPath) { return res.status(400).json({ error: 'Failed to save files. Please check file formats and try again.' })}
    // console.log("resumePath, resumeFileName, excelPath, resumeIsNew, excelIsNew ==> ", resumePath, resumeFileName, excelPath, resumeIsNew, excelIsNew);
    

    // Process Excel file
    const companies = await processExcel(excelPath);
    console.log("============> ", companies);
    

    // Add to queue
    companies.forEach(company => { emailQueue.add({ company, resumePath, resumeFileName })});

    return res.json({ success: true, message: `${companies.length} emails queued for processing`, queued: companies.length });
  } catch (error) {
    logger.error(`Controller Error: ${error.message}`);
    return res.status(500).json({ success: false, error: error.message });
  }
};