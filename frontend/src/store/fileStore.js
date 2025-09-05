import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
    encryptFile, 
    decryptFile,
    importRsaPublicKey,
    importRsaPrivateKey
} from '../lib/cryptoUtils';

const API_URL = import.meta.env.MODE === "development" ? 'http://localhost:5000/api/files' : "/api/files";
axios.defaults.withCredentials = true;

const triggerBrowserDownload = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
};

export const useFileStore = create((set, get) => ({
    files: [],
    publicKey: localStorage.getItem('rsaPublicKeyHex') || '',
    privateKey: '', // Stored in memory only, never persisted
    isLoading: false,
    error: null,

    // --- Key Management ---
    setPublicKey: (key) => {
        localStorage.setItem('rsaPublicKeyHex', key);
        set({ publicKey: key });
        toast.success("Public key saved in browser storage.");
    },
    clearPublicKey: () => {
        localStorage.removeItem('rsaPublicKeyHex');
        set({ publicKey: '' });
        toast.success("Public key cleared.");
    },
    setPrivateKey: (key) => set({ privateKey: key }),

    // --- API Calls ---
    fetchFiles: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/`);
            // The backend now returns a full object, so no mapping is needed.
            set({ files: response.data.files || [], isLoading: false });
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to fetch files.';
            set({ error: msg, isLoading: false, files: [] });
        }
    },

    uploadFile: async (file, onProgress) => {
        const publicKeyHex = get().publicKey;
        set({ isLoading: true, error: null });

        // --- PRE-VALIDATION STEP ---
        let rsaPublicKey;
        try {
            if (!publicKeyHex) throw new Error("Public RSA key is not set.");
            rsaPublicKey = await importRsaPublicKey(publicKeyHex);
        } catch (error) {
            const msg = error.message || 'Invalid Public RSA key.';
            onProgress({ error: true, status: msg, step: 0 });
            toast.error(msg);
            set({ isLoading: false });
            return; 
        }
        // --- END PRE-VALIDATION ---

        try {
            const { encryptedFileBlob, encryptedAesKeyBlob } = await encryptFile(file, rsaPublicKey, onProgress);
            
            const formData = new FormData();
            formData.append('encryptedFile', encryptedFileBlob, file.name);
            formData.append('encryptedAesKey', encryptedAesKeyBlob, `${file.name}.key`);

            await axios.post(`${API_URL}/upload`, formData);
            
            onProgress({ step: 6, status: 'Upload complete!' });
            toast.success('File encrypted and stored successfully!');
            get().fetchFiles();
        } catch (error) {
            const msg = error.message || 'File upload failed.';
            onProgress({ error: true, status: msg });
            toast.error(msg);
        } finally {
            set({ isLoading: false });
        }
    },

    downloadAndDecryptFile: async (filename, onProgress) => {
        const privateKeyHex = get().privateKey;
        set({ isLoading: true });

        let rsaPrivateKey;
        try {
            if (!privateKeyHex) throw new Error("Private key is not provided in the input field.");
            rsaPrivateKey = await importRsaPrivateKey(privateKeyHex);
        } catch (error) {
            // This catch handles an invalid key FORMAT before decryption starts.
            const msg = error.message || 'Invalid Private RSA key.';
            onProgress({ error: true, status: msg, step: 1 }); // Fails at step 1
            throw new Error(msg); 
        }

        try {
            onProgress({ step: 0, status: 'Downloading encrypted file data...' });
            const response = await axios.get(`${API_URL}/download/${filename}`);
            const { encryptedFile, encryptedAesKey } = response.data;
            const encryptedFileBuffer = Uint8Array.from(atob(encryptedFile), c => c.charCodeAt(0)).buffer;
            const encryptedAesKeyBuffer = Uint8Array.from(atob(encryptedAesKey), c => c.charCodeAt(0)).buffer;

            const decryptedFileBlob = await decryptFile(encryptedFileBuffer, encryptedAesKeyBuffer, rsaPrivateKey, onProgress);
            
            set({ isLoading: false });
            return decryptedFileBlob;

        } catch (error) {
            const msg = error.message; // Use the specific message from cryptoUtils
            
            // --- This is the key fix ---
            // Determine which step failed based on the error message content.
            let failedStep = 1; // Default to step 1
            if (msg.includes("corrupted")) {
                failedStep = 2;
            } else if (msg.includes("Hashes do not match")) {
                failedStep = 3;
            }

            onProgress({ error: true, status: msg, step: failedStep });
            set({ isLoading: false });
            throw new Error(msg);
        }
    },
    deleteFile: async (filename) => {
        const toastId = toast.loading(`Deleting ${filename}...`);
        try {
            await axios.delete(`${API_URL}/delete/${filename}`);
            toast.success('File deleted successfully!', { id: toastId });
            // Refresh the file list to reflect the change
            get().fetchFiles();
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to delete file.';
            toast.error(msg, { id: toastId });
        }
    },
}));