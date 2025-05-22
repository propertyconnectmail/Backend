const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ==============================
// Storage Configuration (shared)
// ==============================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = './Public/Temp/';
      fs.mkdirSync(dir, { recursive: true }); // Ensure directory exists
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-');
      cb(null, `${baseName}-${Date.now()}${ext}`);
    }
});

// =====================
// File Type Filters
// =====================

// 1. Image-only filter
const imageFileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png) are allowed.'));
  }
};

// 2. Certification file filter (pdf, doc, docx)
const certificationFileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only certification documents (PDF, DOC, DOCX) are allowed.'));
  }
};

// 3. Mixed document + image filter
const documentAndImageFileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only document and image files are allowed.'));
  }
};

// =====================
// Upload Middlewares
// =====================

// 1. Single image upload
const uploadSingleImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).single('image');

// 2. Multiple certification documents
const uploadCertifications = multer({
  storage,
  fileFilter: certificationFileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB per file
}).array('certifications', 10);

// 3. Multiple documents + images
const uploadDocumentsAndImages = multer({
  storage,
  fileFilter: documentAndImageFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB per file
}).array('files', 10); // Adjust max count if needed

// =====================
// Exports
// =====================
module.exports = {
  uploadSingleImage,
  uploadCertifications,
  uploadDocumentsAndImages
};
