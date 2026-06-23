const pool = require('../config/db');

const createSummaryTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS summaries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        file_name VARCHAR(255) NOT NULL,
        original_text TEXT,
        summary TEXT,
        rating INTEGER DEFAULT NULL,
        feedback TEXT DEFAULT NULL,
        is_saved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
    console.log('Summaries table initialized successfully');
  } catch (err) {
    console.error('Error creating summaries table:', err.message);
  }
};

createSummaryTable();

module.exports = pool;
