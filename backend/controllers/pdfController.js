const fs = require('fs');
const pdfParse = require('pdf-parse');
const pool = require('../config/db');
const { summarizePDF } = require('../services/geminiService');
const { sendSummaryEmail } = require('../services/notificationService');

const uploadAndSummarize = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded.' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ message: 'PDF appears to be empty or unreadable.' });
    }

    const aiResult = await summarizePDF(extractedText);

    const result = await pool.query(
      `INSERT INTO summaries (user_id, file_name, original_text, summary)
       VALUES ($1, $2, $3, $4)
       RETURNING id, file_name, summary, created_at`,
      [req.user.id, fileName, extractedText, JSON.stringify(aiResult)]
    );

    fs.unlinkSync(filePath);

    const userResult = await pool.query('SELECT email, name FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];
    await sendSummaryEmail(user.email, user.name, fileName);

    res.status(200).json({
      message: 'PDF summarized successfully.',
      summaryId: result.rows[0].id,
      fileName: result.rows[0].file_name,
      result: aiResult,
      createdAt: result.rows[0].created_at
    });
  } catch (err) {
    res.status(500).json({ message: 'Summarization failed.', error: err.message });
  }
};

module.exports = { uploadAndSummarize };
