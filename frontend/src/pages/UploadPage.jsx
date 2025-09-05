import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File , Key, CheckCircle, Loader, XCircle, ArrowLeft } from 'lucide-react';
import { useFileStore } from '../store/fileStore';
import { Link } from 'react-router';

const CryptoProcessLog = ({ progress }) => {
    const steps = [
        "Generate random AES-256 key",
        "Calculate SHA-256 digest of the file",
        "Encrypt file content with AES-256-GCM",
        "Encrypt AES key with RSA public key",
        "Store encrypted file on server"
    ];

    const getIcon = (stepIndex) => {
        const currentStep = stepIndex + 1;
        if (progress.error && progress.step === currentStep) return <XCircle className="text-red-500"/>;
        if (progress.step > currentStep) return <CheckCircle className="text-green-500"/>;
        if (progress.step === currentStep) return <Loader className="animate-spin text-teal-500"/>;
        return <CheckCircle className="text-zinc-600"/>; // Pending steps
    };

    return (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg mt-8">
            <h3 className="font-bold">Cryptographic Process</h3>
            <div className="mt-4 space-y-3">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-4 text-sm">
                        {getIcon(index)}
                        <p className={progress.step > index ? "text-zinc-500 dark:text-zinc-400" : ""}>{step}</p>
                    </div>
                ))}
            </div>
            {progress.error && <p className="text-red-500 text-sm mt-4">{progress.status}</p>}
        </div>
    );
};

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const { publicKey, uploadFile, isLoading } = useFileStore();
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState({ step: 0 });

    const onDrop = useCallback(acceptedFiles => {
        setFile(acceptedFiles[0]);
        setIsUploading(false);
        setProgress({ step: 0, error: false, status: '' });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false});

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setProgress({ step: 0 });
        await uploadFile(file, (p) => setProgress(prev => ({ ...prev, ...p })));
    };

    return (
        <div>
            <Link to="/" className="flex items-center gap-2 text-sm text-teal-500 hover:underline mb-4">
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold">Upload & Encrypt</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Securely encrypt and store your confidential files.</p>

            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg mt-8">
                <h3 className="font-bold mb-4">Select File To Encrypt</h3>
                <div {...getRootProps()} className={`p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-teal-500 bg-teal-500/10' : 'border-zinc-300 dark:border-zinc-700'}`}>
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center text-zinc-500 dark:text-zinc-400">
                        <UploadCloud className="h-10 w-10 mb-2" />
                        {file ? <p>{file.name}</p> : <p>Drop your file here, or click to browse</p>}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg mt-8">
                <h3 className="font-bold mb-2">RSA Public Key</h3>
                {publicKey ? 
                    <p className="text-sm text-green-500 flex items-center gap-2"><CheckCircle size={16}/> Key Loaded from Browser Storage</p> :
                    <p className="text-sm text-amber-500">Public key not found. Go to Key Management to add one.</p>
                }
                <textarea readOnly value={publicKey} rows="3" className="w-full p-2 mt-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md font-mono text-xs"/>
            </div>

            {file && <CryptoProcessLog progress={progress} />}

            <button onClick={handleUpload} disabled={!file || !publicKey || isLoading} className="mt-8 w-full py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Processing...' : 'Start Encryption & Upload'}
            </button>
        </div>
    );
}