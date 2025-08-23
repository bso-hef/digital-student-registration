import fs from "fs";
import multer from "multer";
import path from "path";

import Logger from "../app/services/Logger/index.js";

const logger = new Logger("Config <<==>> Multer");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Ensure upload directory exists
      logger.info(`Created upload directory: ${uploadDir}`);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to allow specific file types
const documentFilter = (req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/x-icon",
    "image/svg+xml",
    "video/mp4",
    "video/mov",
    "video/quicktime",
    "video/wmv",
    "video/avi",
    "video/mkv",
    "video/mpeg",
    "video/webm",
    "audio/mpeg",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    req.fileValidationError = "Only specific file types are allowed!";
    cb(null, false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: documentFilter,
  limits: { fileSize: 200 * 1024 * 1024 }, // Max file size: 200 MB
});

// Utility function to delete a file
const deleteFile = filePath => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, err => {
      if (err) {
        logger.error(`Error deleting file: ${filePath}`, err);
      } else {
        logger.info(`Successfully deleted file: ${filePath}`);
      }
    });
  } else {
    logger.info(`File not found for deletion: ${filePath}`);
  }
};

// Utility function to check file existence
const fileExists = filePath => {
  return fs.existsSync(filePath);
};

// Utility function to get file size
const getFileSize = filePath => {
  if (fileExists(filePath)) {
    const stats = fs.statSync(filePath);
    return stats.size;
  } else {
    logger.warn(`File does not exist: ${filePath}`);
    return null;
  }
};

// Exporting the Multer upload instance and utility functions
export { upload, deleteFile, fileExists, getFileSize };
