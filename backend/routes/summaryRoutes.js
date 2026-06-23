const express = require('express');
const router = express.Router();
const {
  getUserSummaries,
  getSummaryById,
  submitRating,
  askQuestion,
  getAllSummaries,
  getAnalytics
} = require('../controllers/summaryController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/my', verifyToken, getUserSummaries);
router.get('/all', verifyToken, verifyAdmin, getAllSummaries);
router.get('/analytics', verifyToken, verifyAdmin, getAnalytics);
router.get('/:id', verifyToken, getSummaryById);
router.post('/:id/rate', verifyToken, submitRating);
router.post('/:id/ask', verifyToken, askQuestion);

module.exports = router;
