const express = require('express');
const router = express.Router();
const { uploadAndSummarize } = require('../controllers/pdfController');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', verifyToken, upload.single('pdf'), uploadAndSummarize);

module.exports = router;
