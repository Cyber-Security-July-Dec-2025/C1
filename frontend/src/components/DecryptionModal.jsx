import { useState } from 'react';
import { useFileStore } from '../store/fileStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader, XCircle, Copy, Download } from 'lucide-react';
import toast from 'react-hot-toast';

// Helper component for displaying a single step in the process
const ProgressStep = ({ title, status, data, icon }) => {
    const copyToClipboard = () => {
        if (!data) return;
        navigator.clipboard.writeText(data);
        toast.success("Copied to clipboard!");
    };
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                {icon}
                {/* Render the vertical line only if it's not the last step */}
                {title.startsWith("Verify") ? null : <div className="w-px h-full bg-zinc-700/50" />}
            </div>
            <div className="pb-8 flex-1">
                <p className="font-semibold">{title}</p>
                <p className={`text-sm ${data ? 'font-mono text-zinc-500' : 'text-zinc-400'}`}>{status}</p>
                {data && (
                    <div className="relative mt-1">
                        <p className="font-mono text-xs bg-zinc-800 p-2 pr-8 rounded-md truncate" title={data}>{data}</p>
                        <button onClick={copyToClipboard} className="absolute top-1/2 right-2 -translate-y-1/2 text-zinc-500 hover:text-white"><Copy size={14}/></button>
                    </div>
                )}
            </div>
        </div>
    );
};


export default function DecryptionModal({ file, onClose }) {
    // Single state object to manage the entire process
    const [progress, setProgress] = useState({ step: 0, status: '', error: false, data: {} });
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [decryptedBlob, setDecryptedBlob] = useState(null);
    const { downloadAndDecryptFile } = useFileStore();

    const handleStartDecryption = async () => {
        setIsDecrypting(true);
        setDecryptedBlob(null);
        setProgress({ step: 0, status: '', error: false, data: {} }); // Reset progress

        try {
            const blob = await downloadAndDecryptFile(file.name, setProgress);
            setDecryptedBlob(blob);
        } catch (err) {
            console.error("Decryption failed:", err.message);
        } finally {
            setIsDecrypting(false);
        }
    };

    const handleDownloadAndClose = () => {
        if (!decryptedBlob) return;
        const url = window.URL.createObjectURL(decryptedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        onClose();
    };

    const steps = ["Decrypt AES key with private RSA key", "Use AES key to decrypt the file content", "Verify file integrity with SHA-256 hash"];

    const getIcon = (stepIndex) => {
        const currentStep = stepIndex + 1;

        // --- Corrected Logic ---
        if (progress.error) {
            if (progress.step === currentStep) return <XCircle className="text-red-500"/>; // The step that failed
            if (progress.step > currentStep) return <CheckCircle className="text-green-500"/>; // Steps before failure are complete
            return <CheckCircle className="text-zinc-600"/>; // Steps after failure are cancelled (greyed out)
        }

        if (progress.step >= currentStep) return <CheckCircle className="text-green-500"/>; // Completed step
        if (isDecrypting && progress.step === stepIndex) return <Loader className="animate-spin text-teal-500"/>; // Currently processing step
        
        return <CheckCircle className="text-zinc-600"/>; // Pending step
    };
    
    // --- THIS FUNCTION CONTAINS THE FIX ---
    const getStatusInfo = (stepIndex) => {
        const currentStep = stepIndex + 1;

        if (!progress.error && progress.step >= currentStep) {
            // **THE FIX**: Use optional chaining (`?.`) and provide a fallback.
            // This prevents the "Cannot read properties of undefined" error.
            // If `progress.data` is undefined, it will safely return `undefined` instead of crashing.
            if (stepIndex === 0) return { status: progress.data?.aesKeyHex || "Completed.", data: progress.data?.aesKeyHex };
            if (stepIndex === 1) return { status: "File content has been decrypted." };
            if (stepIndex === 2) return { status: `Hashes match.`, data: progress.data?.hashMatch };
            return { status: "Completed." }; // A generic fallback for completed steps
        }

        if (progress.error && progress.step < currentStep) {
            return { status: "Cancelled due to error." };
        }

        if (progress.error && progress.step === currentStep) {
            return { status: progress.status };
        }
        
        if (isDecrypting && progress.step >= stepIndex) {
            return { status: "Processing..." };
        }

        return { status: "Pending..." };
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                    className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* --- Modal Header --- */}
                    <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                        <div>
                            <h2 className="font-bold text-lg">Decrypting File</h2>
                            <p className="text-sm text-zinc-400 font-mono truncate max-w-md">{file.name}</p>
                        </div>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-800"><X size={20}/></button>
                    </div>

                    {/* --- Cryptographic Process Steps --- */}
                    <div className="p-6">
                        <h3 className="font-semibold mb-4">Cryptographic Process</h3>
                        <div className="relative">
                            {steps.map((step, index) => {
                                // This component will no longer crash
                                const { status, data } = getStatusInfo(index);
                                return <ProgressStep key={index} title={step} icon={getIcon(index)} status={status} data={data} />
                            })}
                        </div>
                    </div>
                    
                    {/* --- Footer with Status and Actions --- */}
                    <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 rounded-b-xl flex flex-col items-center gap-4">
                        {decryptedBlob && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-center bg-green-500/10 text-green-400 p-3 rounded-md text-sm flex items-center justify-center gap-2">
                                <CheckCircle size={16}/> File decrypted and ready for download!
                            </motion.div>
                        )}
                        {progress.error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-center bg-red-500/10 text-red-400 p-3 rounded-md text-sm flex items-center justify-center gap-2">
                                <XCircle size={16}/> {progress.status}
                            </motion.div>
                        )}
                        <div className="flex items-center gap-4">
                             <button onClick={onClose} className="px-4 py-2 text-sm rounded-md bg-zinc-700 hover:bg-zinc-600">Close</button>
                             {decryptedBlob ? (
                                <button onClick={handleDownloadAndClose} className="px-4 py-2 text-sm rounded-md bg-teal-600 hover:bg-teal-500 font-semibold flex items-center gap-2">
                                    <Download size={16}/> Download File
                                </button>
                             ) : (
                                <button onClick={handleStartDecryption} disabled={isDecrypting} className="px-4 py-2 text-sm rounded-md bg-teal-600 hover:bg-teal-500 font-semibold disabled:opacity-50 disabled:cursor-wait">
                                     {isDecrypting ? 'Decrypting...' : 'Start Decryption'}
                                </button>
                             )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}