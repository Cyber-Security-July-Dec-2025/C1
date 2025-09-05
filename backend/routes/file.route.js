import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { upload } from '../middleware/multer.js';
import {
    uploadFile,
    getUserFiles,
    downloadFile,
    deleteFile
} from '../controllers/file.controller.js';

const router = express.Router();

// Route to upload a file. All routes here are protected.
// It uses multer to handle two fields: 'encryptedFile' and 'encryptedAesKey'
router.post('/upload', verifyToken,
    upload.fields([
    { name: 'encryptedFile', maxCount: 1 },
    { name: 'encryptedAesKey', maxCount: 1 },
    ]),
    uploadFile
);

// Route to get a list of all files for the logged-in user
router.get('/', verifyToken, getUserFiles);

// Route to download a specific file and its key
router.get('/download/:filename', verifyToken, downloadFile);

router.delete('/delete/:filename', verifyToken, deleteFile);

export default router;