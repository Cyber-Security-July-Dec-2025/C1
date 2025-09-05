import { useState } from 'react';
import { Loader, KeyRound, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateRsaKeyPairHex } from '../lib/cryptoUtils';

export default function KeyGenerator() {
    const [keys, setKeys] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        const toastId = toast.loading('Generating 2048-bit RSA key pair...');
        try {
            const keyPair = await generateRsaKeyPairHex();
            setKeys(keyPair);
            toast.success('Keys generated! Save your private key now.', { id: toastId });
        } catch (e) {
            toast.error('Failed to generate keys.', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (key, keyName) => {
        if (!key) return;
        navigator.clipboard.writeText(key);
        toast.success(`${keyName} copied to clipboard!`);
    };

    return (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg mt-8">
            <h3 className="font-bold mb-4">RSA Key Pair Generation</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                Generate a new key pair for encryption. After generating, copy the public key and save it using the form above.
                <strong className="text-red-400"> Securely store the private key offline. It cannot be recovered.</strong>
            </p>
            <button onClick={handleGenerate} disabled={isLoading} className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-zinc-600 text-white font-bold rounded-lg hover:bg-zinc-700 disabled:opacity-50">
                {isLoading ? <Loader size={18} className="animate-spin" /> : <KeyRound size={18} />} Generate New Keys
            </button>

            {keys && (
                <div className="mt-6 space-y-4 font-mono text-xs">
                    <div>
                        <label className="block font-sans text-sm font-medium mb-1">Public Key (SPKI, HEX)</label>
                        <div className="relative">
                            <textarea readOnly value={keys.publicKey} rows="4" className="w-full p-2 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                            <button onClick={() => copyToClipboard(keys.publicKey, 'Public Key')} className="absolute bottom-4 right-2 text-zinc-500 hover:text-white"><Copy size={16}/></button>
                        </div>
                    </div>
                     <div>
                        <label className="block font-sans text-sm font-medium text-red-400 mb-1">Private Key (PKCS#8, HEX)</label>
                        <div className="relative">
                            <textarea readOnly value={keys.privateKey} rows="11" className="w-full p-2 bg-zinc-200 dark:bg-zinc-800 rounded-md border border-red-500/30" />
                            <button onClick={() => copyToClipboard(keys.privateKey, 'Private Key')} className="absolute bottom-4 right-2 text-zinc-500 hover:text-white"><Copy size={16}/></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}