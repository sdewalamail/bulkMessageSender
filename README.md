#### CURL ########
curl -X POST http://localhost:3000/api/send-emails \
  -H "Content-Type: multipart/form-data" \
  -F "resume=@./sample_resume.pdf" \
  -F "companies=@./companies_list.xlsx" \
  -F "message=Here is my application package for your review."

### ENV example ################

PORT=333565
EMAIL_USER=''
EMAIL_PASS=''