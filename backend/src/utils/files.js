const fs = require('fs/promises');
const path = require('path');
const { uploadDir } = require('../config');
const logger = require('./logger');

exports.publicPath = (filename) => `/uploads/${filename}`;

// Never throws: by the time this runs the DB change has already succeeded,
// so a failed cleanup must not turn the response into a 500.
exports.removeUpload = async (storedPath) => {
  if (!storedPath) return;
  const target = path.join(uploadDir, path.basename(storedPath)); // basename blocks ../ traversal
  try {
    await fs.unlink(target);
  } catch (err) {
    if (err.code !== 'ENOENT') logger.warn('file_delete_failed', { file: path.basename(target), err: err.message });
  }
};