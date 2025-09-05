import { useEffect } from 'react';
import { FileText, Download, Loader, RefreshCw, ServerCrash } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFileStore } from '../store/fileStore';
import toast from 'react-hot-toast';

export default function FileList() {
    const { files, fetchFiles, downloadAndDecryptFile, isLoading, error } = useFileStore();

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const handleDownload = (filename) => {
        const privateKey = window.prompt("Please paste your PRIVATE RSA key (HEX) to decrypt the file:");
        if (privateKey) {
            downloadAndDecryptFile(filename, privateKey);
        } else {
            toast.error("Private key is required to decrypt and download.");
        }
    };

    return (
        <div className="bg-zinc-800/50 border border-zinc-700 p-6 rounded-lg shadow-lg mt-8">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-teal-400" />
                    <h2 className="text-xl font-bold">Your Encrypted Files</h2>
                </div>
                <button onClick={fetchFiles} disabled={isLoading} className="p-2 rounded-full hover:bg-zinc-700 disabled:opacity-50">
                    <RefreshCw size={18} className={isLoading ? "animate-spin" : ""}/>
                </button>
            </div>
            
            <div className="h-64 overflow-y-auto pr-2">
                {isLoading && files.length === 0 && <div className="flex justify-center items-center h-full"><Loader className="animate-spin text-teal-400"/></div>}
                {error && <div className="flex flex-col justify-center items-center h-full text-red-400"><ServerCrash size={32}/><p className="mt-2">{error}</p></div>}
                {!isLoading && !error && files.length === 0 && <p className="text-zinc-400 text-center mt-8">You have no files stored.</p>}
                
                <ul className="space-y-2">
                    {files.map(filename => (
                        <motion.li
                            key={filename}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex justify-between items-center bg-zinc-900 p-3 rounded-md border border-zinc-700"
                        >
                            <span className="font-mono text-sm truncate" title={filename}>{filename}</span>
                            <button onClick={() => handleDownload(filename)} className="flex items-center gap-2 text-xs bg-teal-600 px-3 py-1.5 rounded-md hover:bg-teal-700 transition-colors">
                                <Download size={14}/> Decrypt
                            </button>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </div>
    );
}