const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const { uploadDir, maxUploadBytes } = require('../config');
const AppError = require('../utils/ApiError'); // adjust if your AppError lives elsewhere

fs.mkdirSync(uploadDir, { recursive: true });

const MIME_EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

module.exports = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    // The name comes from us, never from file.originalname
    filename: (req, file, cb) => cb(null, crypto.randomUUID() + MIME_EXT[file.mimetype]),
  }),
  limits: {
    fileSize: maxUploadBytes,
    files: 1,
    fields: 20,             // caps the number of text fields
    fieldSize: 100 * 1024,  // caps each text field at 100 KB
  },
  fileFilter: (req, file, cb) =>
    MIME_EXT[file.mimetype]
      ? cb(null, true)
      : cb(new AppError('Only JPEG, PNG or WebP images are allowed', 400)),
}).single('profile_picture');