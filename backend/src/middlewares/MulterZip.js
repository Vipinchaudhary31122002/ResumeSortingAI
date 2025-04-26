import multer from 'multer';

// Use memory storage to avoid saving to disk
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/zip' ||
      file.originalname.toLowerCase().endsWith('.zip')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .zip files are allowed'), false);
    }
  },
});
