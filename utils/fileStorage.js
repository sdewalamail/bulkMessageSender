const path = require('path');
const crypto = require('crypto');
const fs = require('fs').promises;

exports.saveFiles = async (resume, excel) => {
  const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');

  // Validate file types
  const resumeExt = path.extname(resume.name).toLowerCase();
  const excelExt = path.extname(excel.name).toLowerCase();

  const validResumeExtensions = ['.pdf', '.doc', '.docx'];
  const validExcelExtensions = ['.xlsx', '.xls', '.csv'];

  if (!validResumeExtensions.includes(resumeExt)) {
    throw new Error(`Invalid resume format. Allowed types: ${validResumeExtensions.join(', ')}`);
  }

  if (!validExcelExtensions.includes(excelExt)) {
    throw new Error(`Invalid Excel format. Allowed types: ${validExcelExtensions.join(', ')}`);
  }

  // Create directories if not exist
  await fs.mkdir(path.join(uploadDir, 'resumes'), { recursive: true });
  await fs.mkdir(path.join(uploadDir, 'excels'), { recursive: true });

  // Helper function to process files
  const processFile = async (file, type) => {
    const buffer = file.data;
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const ext = path.extname(file.name).toLowerCase();
    const filename = `${hash}${ext}`;
    const dir = type === 'resume' ? 'resumes' : 'excels';
    const filePath = path.join(uploadDir, dir, filename);

    try {
      await fs.access(filePath);
      return { path: filePath, filename, isNew: false };
    } catch (err) {
      await fs.writeFile(filePath, buffer);
      return { path: filePath, filename, isNew: true };
    }
  };

  // Process both files
  const resumeResult = await processFile(resume, 'resume');
  const excelResult = await processFile(excel, 'excel');

  return { resumePath: resumeResult.path, resumeFileName: resumeResult.filename, excelPath: excelResult.path, resumeIsNew: resumeResult.isNew, excelIsNew: excelResult.isNew };
};