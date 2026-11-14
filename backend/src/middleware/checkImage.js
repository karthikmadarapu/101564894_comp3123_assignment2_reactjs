const fs = require('fs/promises');
const AppError = require('../utils/ApiError');

// The first bytes of a file reveal its real type, whatever the name or MIME header says
const SIGNATURES = {
  'image/jpeg': (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  'image/png':  (b) => b.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47])),
  'image/webp': (b) => b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP',
};

module.exports = async (req, res, next) => {
  if (!req.file) return next();
  let fh;
  try {
    fh = await fs.open(req.file.path, 'r');
    const buf = Buffer.alloc(12);
    await fh.read(buf, 0, 12, 0);
    const check = SIGNATURES[req.file.mimetype];
    if (!check || !check(buf)) throw new AppError('File is not a valid image', 400);
    next();
  } catch (err) {
    next(err);                 // errorHandler deletes req.file
  } finally {
    if (fh) await fh.close();  // always release the file handle
  }
};