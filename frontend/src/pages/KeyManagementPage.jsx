import { useState, useEffect } from 'react';
import { KeyRound, ShieldAlert, CheckCircle, Clipboard, Trash2 } from 'lucide-react';
import { useFileStore } from '../store/fileStore';
import toast from 'react-hot-toast';
import KeyGenerator from '../components/KeyGenerator';

export default function KeyManagementPage() {
    const { publicKey, setPublicKey, clearPublicKey } = useFileStore();
    const [newKey, setNewKey] = useState('');

    useEffect(() => {
        setNewKey(publicKey);
    }, [publicKey]);

    const handleSave = () => {
        if (!newKey) {
            toast.error("Key field cannot be empty.");
            return;
        }
        setPublicKey(newKey);
    };
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(publicKey);
        toast.success('Key copied!');
    };

    return (
        <div>
            <div className="flex items-center gap-3">
                <KeyRound className="h-8 w-8 text-teal-500" />
                <h1 className="text-2xl font-bold">Key Management</h1>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400">Manage your RSA encryption keys.</p>

            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg mt-8 text-amber-300/80 text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300"><ShieldAlert size={18}/> Security Guidelines:</div>
                <ul className="list-disc list-inside">
                    <li>Generate your RSA key pair offline using secure tools (e.g., OpenSSL).</li>
                    <li>Only your public key is stored in browser localStorage.</li>
                    <li>Private keys are never stored - enter them only when needed for decryption.</li>
                    <li>Use this system only on trusted, secure devices.</li>
                </ul>
            </div>
            
            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg mt-8">
                <h3 className="font-bold mb-4">Key Status</h3>
                {publicKey ? (
                    <div>
                        <p className="flex items-center gap-2 text-green-500 text-sm"><CheckCircle size={16}/> Public Key Stored</p>
                        <div className="relative mt-2">
                           <p className="font-mono text-xs bg-zinc-200 dark:bg-zinc-800 p-2 rounded-md pr-10 truncate">
                               {publicKey}
                           </p>
                           <button onClick={copyToClipboard} className="absolute top-1/2 right-2 -translate-y-1/2 text-zinc-500 hover:text-white"><Clipboard size={16}/></button>
                        </div>
                       <button onClick={clearPublicKey} className="flex items-center gap-2 text-sm text-red-500 hover:underline mt-4"><Trash2 size={14}/> Clear Stored Key</button>
                    </div>
                ) : (
                    <p className="text-zinc-500 text-sm">No public key is currently stored in your browser.</p>
                )}
            </div>

            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg mt-8">
                <h3 className="font-bold mb-2">Public Key Management</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Enter your RSA public key in HEX format to save it for encryption sessions.</p>
                <textarea value={newKey} onChange={(e) => setNewKey(e.target.value)} rows="6" className="w-full p-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md font-mono text-xs"/>
                <button onClick={handleSave} className="mt-4 px-4 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700">
                    Save Public Key
                </button>
            </div>
            <KeyGenerator />
        </div>
    );
}