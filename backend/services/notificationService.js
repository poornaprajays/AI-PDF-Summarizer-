const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendSummaryEmail = async (toEmail, userName, fileName) => {
  try {
    await transporter.sendMail({
      from: `"AI PDF Summarizer" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Your PDF Summary is Ready!',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
          <h2 style="color: #534AB7;">Hi ${userName} 👋</h2>
          <p>Your PDF <strong>${fileName}</strong> has been summarized successfully.</p>
          <p>Log in to your dashboard to view the full summary, key points, and follow-up questions.</p>
          <a href="${process.env.CLIENT_URL}/dashboard"
             style="display:inline-block;margin-top:16px;padding:12px 24px;background:#534AB7;color:#fff;border-radius:8px;text-decoration:none;">
            View Summary
          </a>
          <p style="margin-top:24px;color:#888;font-size:12px;">AI PDF Summarizer — powered by Gemini</p>
        </div>
      `
    });
    console.log(`Summary email sent to ${toEmail}`);
  } catch (err) {
    console.error('Email sending failed:', err.message);
  }
};

module.exports = { sendSummaryEmail };
