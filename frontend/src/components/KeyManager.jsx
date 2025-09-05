import { useState } from 'react';
import { KeyRound, Copy, Save, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { generateRsaKeyPairHex } from '../lib/cryptoUtils';

export default function KeyManager() {
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateKeys = async () => {
        setIsLoading(true);
        toast.loading('Generating 2048-bit RSA keys...');
        try {
            const { publicKey, privateKey } = await generateRsaKeyPairHex();
            setPublicKey(publicKey);
            setPrivateKey(privateKey);
            toast.success('Keys generated! Save your private key now.');
        } catch (error) {
            toast.error('Failed to generate keys.');
        } finally {
            setIsLoading(false);
            toast.dismiss();
        }
    };

    const copyToClipboard = (key, keyName) => {
        if (!key) return;
        navigator.clipboard.writeText(key);
        toast.success(`${keyName} copied to clipboard!`);
    };

    const savePublicKey = () => {
        if (!publicKey) return;
        localStorage.setItem('rsaPublicKeyHex', publicKey);
        toast.success('Public key saved to browser storage.');
    };

    return (
        <div className="bg-zinc-800/50 border border-zinc-700 p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-4">
                <KeyRound className="w-6 h-6 text-teal-400" />
                <h2 className="text-xl font-bold">RSA Key Management</h2>
            </div>
            
            <p className="text-zinc-400 mb-4 text-sm">Generate your RSA key pair here. Your public key is used for encryption. <strong className="text-amber-400">Your private key is for decryption and is NEVER stored. Save it in a secure location immediately.</strong></p>

            <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleGenerateKeys}
                disabled={isLoading}
                className="w-full py-2 px-4 bg-gradient-to-r from-teal-500 to-teal-600 font-bold rounded-lg shadow-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {isLoading ? <Loader className="animate-spin" /> : "Generate New Key Pair"}
            </motion.button>
            
            {publicKey && (
                <div className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Public Key (HEX)</label>
                        <div className="relative">
                            <textarea readOnly value={publicKey} rows="3" className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-md font-mono text-xs"/>
                            <button onClick={() => copyToClipboard(publicKey, 'Public key')} className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-white"><Copy size={16}/></button>
                        </div>
                        <button onClick={savePublicKey} className="mt-2 text-xs flex items-center gap-1 text-teal-400 hover:underline"><Save size={14}/> Save to Browser</button>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-red-400 mb-1">Private Key (HEX) - Save this!</label>
                        <div className="relative">
                            <textarea readOnly value={privateKey} rows="5" className="w-full p-2 bg-zinc-900 border border-red-500/50 rounded-md font-mono text-xs"/>
                            <button onClick={() => copyToClipboard(privateKey, 'Private key')} className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-white"><Copy size={16}/></button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}