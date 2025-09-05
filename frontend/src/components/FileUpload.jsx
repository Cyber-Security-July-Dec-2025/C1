import { useState, useEffect } from 'react';
import { UploadCloud, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFileStore } from '../store/fileStore';

export default function FileUpload() {
    const [file, setFile] = useState(null);
    const [publicKeyHex, setPublicKeyHex] = useState('');
    const { uploadFile, isLoading } = useFileStore();

    useEffect(() => {
        // Pre-fill public key from localStorage if it exists
        const storedKey = localStorage.getItem('rsaPublicKeyHex');
        if (storedKey) {
            setPublicKeyHex(storedKey);
        }
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file || !publicKeyHex) return;
        uploadFile(file, publicKeyHex);
    };

    return (
        <div className="bg-zinc-800/50 border border-zinc-700 p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-4">
                <UploadCloud className="w-6 h-6 text-teal-400" />
                <h2 className="text-xl font-bold">Encrypt & Upload File</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="file-upload" className="block text-sm font-medium text-zinc-300 mb-1">Select File</label>
                    <input id="file-upload" type="file" onChange={handleFileChange} required className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600"/>
                </div>
                <div>
                    <label htmlFor="public-key" className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1"><Key size={14}/> Public Key (HEX)</label>
                    <textarea id="public-key" value={publicKeyHex} onChange={(e) => setPublicKeyHex(e.target.value)} required rows="3" placeholder="Paste your public RSA key here..." className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-md font-mono text-xs"/>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || !file || !publicKeyHex}
                    className="w-full py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 font-bold rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                >
                    {isLoading ? 'Processing...' : 'Encrypt & Upload'}
                </motion.button>
            </form>
        </div>
    );
}