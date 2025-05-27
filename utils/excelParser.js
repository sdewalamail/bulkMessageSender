const ExcelJS = require('exceljs');

exports.processExcel = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.worksheets[0];
  const companies = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // Skip header row
      companies.push({
        name: row.getCell(1).text.trim(),
        email: row.getCell(2).text.trim(),
        phone: row.getCell(3).text.trim()
      });
    }
  });   
  return companies.filter(c => validateEmail(c.email));
};

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}