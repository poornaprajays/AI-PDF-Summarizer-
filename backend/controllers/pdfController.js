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

    const fileName = req.file.originalname;

    // req.file.buffer is provided by multer memoryStorage (works in cloud)
    // No filesystem reads needed — the buffer is the file
    const pdfData = await pdfParse(req.file.buffer);
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

    // No fs.unlinkSync needed — memory storage has no temp file to delete

    // Send email notification — non-blocking, won't fail the upload if email isn't configured
    pool.query('SELECT email, name FROM users WHERE id = $1', [req.user.id])
      .then(userResult => sendSummaryEmail(userResult.rows[0].email, userResult.rows[0].name, fileName))
      .catch(emailErr => console.warn('Email notification skipped:', emailErr.message));

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
