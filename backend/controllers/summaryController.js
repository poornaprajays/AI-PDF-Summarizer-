const pool = require('../config/db');
const { answerQuestion } = require('../services/geminiService');

const getUserSummaries = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, file_name, summary, rating, feedback, is_saved, created_at
       FROM summaries
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch summaries.', error: err.message });
  }
};

const getSummaryById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM summaries WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Summary not found.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch summary.', error: err.message });
  }
};

const submitRating = async (req, res) => {
  const { rating, feedback } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
  }
  try {
    const result = await pool.query(
      `UPDATE summaries SET rating = $1, feedback = $2
       WHERE id = $3 AND user_id = $4
       RETURNING id, rating, feedback`,
      [rating, feedback || null, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Summary not found.' });
    }
    res.status(200).json({ message: 'Rating submitted.', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Could not submit rating.', error: err.message });
  }
};

const askQuestion = async (req, res) => {
  const { question } = req.body;
  if (!question || question.trim().length === 0) {
    return res.status(400).json({ message: 'Question cannot be empty.' });
  }
  try {
    const result = await pool.query(
      `SELECT original_text FROM summaries WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Summary not found.' });
    }
    const answer = await answerQuestion(result.rows[0].original_text, question);
    res.status(200).json({ question, answer });
  } catch (err) {
    res.status(500).json({ message: 'Could not process question.', error: err.message });
  }
};

const getAllSummaries = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.file_name, s.rating, s.created_at,
              u.name AS user_name, u.email AS user_email
       FROM summaries s
       JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch all summaries.', error: err.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await pool.query(`SELECT COUNT(*) FROM users`);
    const totalSummaries = await pool.query(`SELECT COUNT(*) FROM summaries`);
    const avgRating = await pool.query(`SELECT ROUND(AVG(rating)::numeric, 2) AS avg_rating FROM summaries WHERE rating IS NOT NULL`);
    const todayUploads = await pool.query(
      `SELECT COUNT(*) FROM summaries WHERE created_at::date = CURRENT_DATE`
    );
    const recentSignups = await pool.query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS count
       FROM users
       GROUP BY DATE(created_at)
       ORDER BY date DESC
       LIMIT 7`
    );
    const recentUploads = await pool.query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS count
       FROM summaries
       GROUP BY DATE(created_at)
       ORDER BY date DESC
       LIMIT 7`
    );
    res.status(200).json({
      totalUsers: totalUsers.rows[0].count,
      totalSummaries: totalSummaries.rows[0].count,
      avgRating: avgRating.rows[0].avg_rating,
      todayUploads: todayUploads.rows[0].count,
      recentSignups: recentSignups.rows,
      recentUploads: recentUploads.rows
    });
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch analytics.', error: err.message });
  }
};

const toggleSaveSummary = async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE summaries 
       SET is_saved = NOT is_saved 
       WHERE id = $1 AND user_id = $2 
       RETURNING id, is_saved`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Summary not found.' });
    }
    res.status(200).json({ message: 'Saved status updated.', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Could not update saved status.', error: err.message });
  }
};

module.exports = {
  getUserSummaries,
  getSummaryById,
  submitRating,
  askQuestion,
  getAllSummaries,
  getAnalytics,
  toggleSaveSummary
};
