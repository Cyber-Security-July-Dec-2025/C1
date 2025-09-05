import fs from 'fs/promises';
import path from 'path';

// --- Helper function to ensure user's upload directory exists ---
const ensureUserDir = async (userId) => {
    const userDir = path.resolve('uploads', userId);
    try {
        await fs.mkdir(userDir, { recursive: true });
        return userDir;
    } catch (error) {
        console.error("Error creating user directory:", error);
        throw new Error("Could not create storage directory for the user.");
    }
};


// --- Controller for handling file uploads ---
export const uploadFile = async (req, res) => {
    try {
        // Ensure files were uploaded
        if (!req.files || !req.files.encryptedFile || !req.files.encryptedAesKey) {
            return res.status(400).json({ success: false, message: 'Missing required files for upload.' });
        }

        const encryptedFile = req.files.encryptedFile[0];
        const encryptedAesKey = req.files.encryptedAesKey[0];
        
        // Use original filename from the encrypted file metadata
        const originalFilename = encryptedFile.originalname;

        // Get the user-specific directory path
        const userDir = await ensureUserDir(req.userId);

        const newFilePath = path.join(userDir, originalFilename);
        const newKeyPath = path.join(userDir, `${originalFilename}.key`);

        // Move the uploaded file and key from temp storage to the user's directory
        await fs.rename(encryptedFile.path, newFilePath);
        await fs.rename(encryptedAesKey.path, newKeyPath);

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            filename: originalFilename
        });

    } catch (error) {
        console.error("Upload Error:", error.message);
        res.status(500).json({ success: false, message: 'Server error during file upload.' });
    }
};


// --- Controller for listing user's files ---
export const getUserFiles = async (req, res) => {
    try {
        const userDir = await ensureUserDir(req.userId);
        const allFilenames = await fs.readdir(userDir);

        // Filter out the .key files
        const mainFiles = allFilenames.filter(file => !file.endsWith('.key'));

        // Get stats for each file
        const filesWithDetails = await Promise.all(
            mainFiles.map(async (filename) => {
                const filePath = path.join(userDir, filename);
                try {
                    const stats = await fs.stat(filePath);
                    return {
                        name: filename,
                        size: stats.size, // Size in bytes
                        uploadDate: stats.mtime, // Last modified time as upload date
                        status: 'Encrypted',
                    };
                } catch (error) {
                    // If a file stat fails, return null to filter it out
                    console.error(`Could not get stats for file: ${filename}`, error);
                    return null;
                }
            })
        );
        
        // Filter out any nulls from failed stat calls
        const validFiles = filesWithDetails.filter(file => file !== null);
        
        res.status(200).json({ success: true, files: validFiles });

    } catch (error) {
        console.error("Get User Files Error:", error.message);
        res.status(500).json({ success: false, message: 'Server error while fetching files.' });
    }
};


// --- Controller for downloading a specific file ---
export const downloadFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const userDir = path.resolve('uploads', req.userId);

        const filePath = path.join(userDir, filename);
        const keyPath = path.join(userDir, `${filename}.key`);

        // Check if both the file and its key exist before proceeding
        await fs.access(filePath);
        await fs.access(keyPath);

        const encryptedFileBuffer = await fs.readFile(filePath);
        const encryptedAesKeyBuffer = await fs.readFile(keyPath);

        // Send both files back as base64 encoded strings in a JSON response
        res.status(200).json({
            success: true,
            encryptedFile: encryptedFileBuffer.toString('base64'),
            encryptedAesKey: encryptedAesKeyBuffer.toString('base64'),
        });

    } catch (error) {
        // Handle file not found and other errors
        if (error.code === 'ENOENT') {
            return res.status(404).json({ success: false, message: 'File not found.' });
        }
        console.error("Download Error:", error.message);
        res.status(500).json({ success: false, message: 'Server error during file download.' });
    }
};

export const deleteFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const userDir = path.resolve('uploads', req.userId);

        const filePath = path.join(userDir, filename);
        const keyPath = path.join(userDir, `${filename}.key`);

        // Use Promise.all to delete both files concurrently
        await Promise.all([
            fs.unlink(filePath),
            fs.unlink(keyPath)
        ]);

        res.status(200).json({ success: true, message: 'File deleted successfully.' });
    } catch (error) {
        if (error.code === 'ENOENT') {
            // If the file is already gone, it's not a server error.
            return res.status(404).json({ success: false, message: 'File not found.' });
        }
        console.error("Delete Error:", error.message);
        res.status(500).json({ success: false, message: 'Server error during file deletion.' });
    }
};