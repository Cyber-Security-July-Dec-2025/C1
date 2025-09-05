const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Helper Functions ---
function bufferToHex(buffer) {
    return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToBuffer(hexString) {
    // Basic validation for hex characters and length
    if (!/^[0-9a-fA-F]*$/.test(hexString) || hexString.length % 2 !== 0) {
        throw new Error("Invalid HEX string provided.");
    }
    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
        bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }
    return bytes.buffer;
}

// --- Key Generation ---
export async function generateRsaKeyPairHex() {
    const keyPair = await window.crypto.subtle.generateKey(
        { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
        true,
        ['encrypt', 'decrypt']
    );
    
    // Export in standard SPKI/PKCS#8 formats
    const publicKeyBuffer = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKeyBuffer = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    return {
        publicKey: bufferToHex(publicKeyBuffer),
        privateKey: bufferToHex(privateKeyBuffer),
    };
}

// --- Key Import (with improved error handling) ---
export async function importRsaPublicKey(hexKey) {
    try {
        const keyBuffer = hexToBuffer(hexKey);
        return await window.crypto.subtle.importKey(
            'spki', keyBuffer, { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt']
        );
    } catch (e) {
        console.error("Public key import failed:", e);
        throw new Error("Invalid Public RSA key. Please use a valid SPKI key in HEX format.");
    }
}

export async function importRsaPrivateKey(hexKey) {
    try {
        const keyBuffer = hexToBuffer(hexKey);
        return await window.crypto.subtle.importKey(
            'pkcs8', keyBuffer, { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['decrypt']
        );
    } catch (e) {
        console.error("Private key import failed:", e);
        throw new Error("Invalid Private RSA key. Please use a valid PKCS#8 key in HEX format.");
    }
}

// --- Main Encryption Process ---
export async function encryptFile(file, rsaPublicKey, onProgress) {
    // 1. Generate AES key
    const aesKey = await window.crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
    onProgress({ step: 1, status: 'Generated random AES-256 key.' });
    await sleep(400);

    // 2. Hash file
    const fileBuffer = await file.arrayBuffer();
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', fileBuffer);
    onProgress({ step: 2, status: 'Calculated SHA-256 digest of the file.' });
    await sleep(400);

    // 3. Encrypt content with AES
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    // **THE FIX, PART 1**: The IV is NO LONGER included in the data to be encrypted.
    const dataToEncrypt = new Uint8Array(hashBuffer.byteLength + fileBuffer.byteLength);
    dataToEncrypt.set(new Uint8Array(hashBuffer), 0);
    dataToEncrypt.set(new Uint8Array(fileBuffer), hashBuffer.byteLength);

    const encryptedContent = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, aesKey, dataToEncrypt);
    onProgress({ step: 3, status: 'Encrypted file content with AES-256-GCM.' });
    await sleep(400);
    
    // 4. Encrypt AES key with RSA
    const exportedRawAesKey = await window.crypto.subtle.exportKey('raw', aesKey);
    const encryptedAesKey = await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, rsaPublicKey, exportedRawAesKey);
    onProgress({ step: 4, status: 'Encrypted AES key with RSA public key.' });
    await sleep(400);

    onProgress({ step: 5, status: 'Storing encrypted file on server...' });
    

    // **THE FIX, PART 2**: A new buffer is created that correctly prepends the IV to the final ciphertext.
    const finalEncryptedBlobContent = new Uint8Array(iv.length + encryptedContent.byteLength);
    finalEncryptedBlobContent.set(iv, 0);
    finalEncryptedBlobContent.set(new Uint8Array(encryptedContent), iv.length);

    return {
        encryptedFileBlob: new Blob([finalEncryptedBlobContent]),
        encryptedAesKeyBlob: new Blob([encryptedAesKey]),
    };
}

// --- Main Decryption Process ---
export async function decryptFile(encryptedFileBuffer, encryptedAesKeyBuffer, rsaPrivateKey, onProgress) {
    let aesKey;
    // --- Step 1: Decrypt AES key ---
    try {
        
        await sleep(400);
        const decryptedAesKeyBytes = await window.crypto.subtle.decrypt({ name: 'RSA-OAEP' }, rsaPrivateKey, encryptedAesKeyBuffer);
        aesKey = await window.crypto.subtle.importKey('raw', decryptedAesKeyBytes, { name: 'AES-GCM' }, true, ['decrypt']);
        onProgress({ step: 1, status: 'Successfully decrypted the AES key.', data: { aesKeyHex: bufferToHex(decryptedAesKeyBytes) } });
        await sleep(400);
    } catch (error) {
        // This is the most common failure point if the private key is wrong.
        console.error("AES Key Decryption Error:", error);
        throw new Error("Failed to decrypt AES key. The provided private key is likely incorrect or does not match the public key used for encryption.");
    }

    // --- Step 2: Decrypt file content ---
    let decryptedCombinedData;
    try {
        const iv = encryptedFileBuffer.slice(0, 12);
        const encryptedData = encryptedFileBuffer.slice(12);
        decryptedCombinedData = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(iv) }, aesKey, encryptedData);
        onProgress({ step: 2, status: 'File content has been decrypted.' });
        await sleep(400);
    } catch (error) {
        console.error("File Content Decryption Error:", error);
        throw new Error("Failed to decrypt file content. The encrypted data may be corrupted.");
    }
    
    // --- Step 3: Verify hash ---
    const decryptedHash = decryptedCombinedData.slice(0, 32);
    const decryptedFileContent = decryptedCombinedData.slice(32);
    const calculatedHashBuffer = await window.crypto.subtle.digest('SHA-256', decryptedFileContent);
    const decryptedHashHex = bufferToHex(decryptedHash);
    const calculatedHashHex = bufferToHex(calculatedHashBuffer);
    
    if (decryptedHashHex !== calculatedHashHex) {
        throw new Error("Integrity check failed: Hashes do not match. The file may be corrupted or has been tampered with.");
    }
    onProgress({ step: 3, status: 'Integrity verified successfully.', data: { hashMatch: calculatedHashHex } });

    return new Blob([decryptedFileContent]);
}