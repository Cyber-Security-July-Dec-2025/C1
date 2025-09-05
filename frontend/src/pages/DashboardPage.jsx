import { useEffect , useState} from 'react';
import { LayoutDashboard, ShieldCheck, DatabaseZap, KeyRound, AlertTriangle, File, LockKeyhole , LockOpen , ServerCrash ,  Trash2 } from 'lucide-react';
import { useFileStore } from '../store/fileStore';
import { motion } from 'framer-motion';
import DecryptionModal from '../components/DecryptionModal';


const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
};

const StatCard = ({ icon: Icon, title, description, color }) => (
    <div className={`bg-white dark:bg-zinc-900/50 p-4 rounded-lg border ${color}`}>
        <div className="flex items-center gap-3">
            <Icon className="h-6 w-6" />
            <h3 className="font-bold text-md">{title}</h3>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">{description}</p>
    </div>
);

const PrivateKeyInput = () => {
    const { privateKey, setPrivateKey } = useFileStore();
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/30 p-6 rounded-lg mt-8">
            <div className="flex items-center gap-3 text-red-400">
                <AlertTriangle />
                <h3 className="font-bold text-lg">Private Key Required for Decryption</h3>
            </div>
            <p className="text-red-300/80 text-sm mt-2">Enter your RSA private key to decrypt files. This key is never stored or transmitted to the server.</p>
            <textarea 
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                rows="11" 
                placeholder="enter your RSA private key in HEX format..."
                className="w-full p-2 mt-4 bg-zinc-900/50 border border-zinc-700 rounded-md font-mono text-xs focus:ring-teal-500 focus:border-teal-500"
            />
        </motion.div>
    );
};

const FileList = ({ onDecryptClick }) => {
    const { files, isLoading, fetchFiles , deleteFile } = useFileStore();

    useEffect(() => { fetchFiles() }, [fetchFiles]);

    const handleDelete = (filename) => {
        if (window.confirm(`Are you sure you want to permanently delete ${filename}? This action cannot be undone.`)) {
            deleteFile(filename);
        }
    };

    if (isLoading && files.length === 0) return <p>Loading files...</p>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg mt-8">
            <div className="flex items-center gap-3">
                <File />
                <h3 className="font-bold text-lg">Encrypted Files ({files.length})</h3>
            </div>
            {files.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                    <LockKeyhole className="mx-auto h-12 w-12" />
                    <p className="mt-4">No encrypted files yet.</p>
                    <p className="text-sm">Upload your first file to get started.</p>
                </div>
            ) : (
                <div className="mt-4 -mx-6">
                    <table className="min-w-full">
                        <thead className="border-b border-zinc-200 dark:border-zinc-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">File Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Size</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Upload Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                             {files.map(file => (
                                <tr key={file.name}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono flex items-center gap-2"><LockKeyhole size={14}/> {file.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">{formatBytes(file.size)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">{formatDate(file.uploadDate)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">{file.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center gap-4">
                                        <button onClick={() => onDecryptClick(file)} className="flex items-center gap-2 text-teal-400 hover:text-teal-300">
                                            <LockOpen size={14}/> Decrypt
                                        </button>
                                        <button onClick={() => handleDelete(file.name)} className="flex items-center gap-2 text-red-500 hover:text-red-400">
                                            <Trash2 size={14}/> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    );
};


export default function DashboardPage() {
    const [fileToDecrypt, setFileToDecrypt] = useState(null);

    return (
        <div>
            <div className="flex items-center gap-3">
                <LayoutDashboard className="h-8 w-8 text-teal-500" />
                <h1 className="text-2xl font-bold">SecureVault Dashboard</h1>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400">End-to-end encrypted file storage.</p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
                <StatCard icon={ShieldCheck} title="Client-Side Encryption" description="All encryption happens in your browser. Your files are encrypted with AES-256-GCM before upload." color="border-green-500/30" />
                <StatCard icon={DatabaseZap} title="Zero-Knowledge Storage" description="The server never sees your encryption keys or unencrypted data. Complete privacy guaranteed." color="border-blue-500/30" />
                <StatCard icon={KeyRound} title="RSA Key Protection" description="Your AES encryption keys are protected with RSA encryption using your own key pair." color="border-purple-500/30" />
            </div>

            <PrivateKeyInput />
            <FileList onDecryptClick={setFileToDecrypt} />

            {fileToDecrypt && (
                <DecryptionModal
                    file={fileToDecrypt}
                    onClose={() => setFileToDecrypt(null)}
                />
            )}

        </div>
    );
}