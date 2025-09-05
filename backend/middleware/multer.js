import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Define the base path for temporary uploads
const TEMP_UPLOADS_DIR = path.resolve('uploads', 'temp');

// Ensure the temporary directory exists
fs.mkdirSync(TEMP_UPLOADS_DIR, { recursive: true });

// Configure multer to use the temporary directory
export const upload = multer({ dest: TEMP_UPLOADS_DIR });