const multer = require('multer');
const path = require('path');

// Use memoryStorage instead of diskStorage so files are kept as
// a Buffer in req.file.buffer — works in serverless/cloud environments
// where there is no persistent filesystem (Railway, Render, etc.)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.pdf') {
    return cb(new Error('Only PDF files are allowed.'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

module.exports = upload;
