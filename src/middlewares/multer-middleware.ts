import multer from 'multer';

// * Setup multer for memory storage
const storage = multer.memoryStorage();

// * initialize multer middleware
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 5 } });

export default upload;
