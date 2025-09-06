# Secure-FIle-Vault
# SecureFileVault: A Zero-Knowledge Encrypted File Store

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

SecureFileVault is a modern, web-based application that allows users to store files with the guarantee of confidentiality and integrity. It employs a **zero-knowledge architecture**, meaning all cryptographic operations are performed on the client-side (in the browser). The server only ever stores encrypted data blobs, ensuring that no one, not even the server administrators, can access the original file content.

---

## 📸 Application Preview

*(It is highly recommended to replace this placeholder with a GIF demonstrating the key generation, file upload, and decryption process.)*

![SecureFileVault Demo](https://i.imgur.com/your-demo-gif-placeholder.gif)

---

## ✨ Core Features

-   🔐 **Complete User Authentication**: Secure JWT-based signup, login, email verification, and password reset functionality.
-   💻 **Client-Side Cryptography**: All encryption, decryption, and hashing operations are performed in the user's browser using the robust **WebCrypto API**.
-   🛡️ **Zero-Knowledge Architecture**: The server has no access to unencrypted file content or the user's private keys, ensuring complete privacy.
-   🔑 **Hybrid Encryption Scheme**: Utilizes a powerful combination of **AES-256-GCM** for symmetric file encryption and **RSA-OAEP (2048-bit)** for asymmetric key encryption.
-   🔎 **File Integrity Verification**: Each file's **SHA-256 hash** is calculated before encryption and verified after decryption to protect against tampering and corruption.
-   🎨 **Interactive UI**: A modern, responsive interface with real-time feedback during cryptographic processes, built with React and Tailwind CSS.
-   📂 **Secure File Management**: Users can upload, view metadata (size, date), decrypt, download, and securely delete their files.
-   🛠️ **In-Browser Key Management**: Users can generate new RSA key pairs, save their public key to browser storage for convenience, and are prompted for their private key only when needed.

---

## 🏛️ How It Works: The Cryptographic Flow

The core security of this application relies on never sending sensitive, unencrypted data to the server.

### Encryption Flow (Uploading a File)

1.  **File Selection**: The user selects a file in the browser.
2.  **AES Key Generation**: A cryptographically secure, random **AES-256-GCM** key is generated in the browser. This key is unique for each file upload.
3.  **File Hashing**: The **SHA-256** digest (hash) of the file content is calculated to ensure its integrity.
4.  **AES Encryption**: The file content and its hash are combined and then encrypted using the generated AES key.
5.  **RSA Encryption**: The AES key itself is encrypted using the user's **public RSA key**.
6.  **Server Storage**: Two pieces of data are sent to the server:
    -   The encrypted file blob (containing the ciphertext and IV).
    -   The encrypted AES key.

### Decryption Flow (Downloading a File)

1.  **Data Retrieval**: The client requests the encrypted file and its corresponding encrypted AES key from the server.
2.  **Private Key Input**: The user is prompted to enter their **private RSA key** into the browser. This key is **never** sent to the server.
3.  **RSA Decryption**: The private key is used to decrypt the AES key.
4.  **AES Decryption**: The now-decrypted AES key is used to decrypt the file content and its embedded hash.
5.  **Integrity Verification**: The SHA-256 hash of the decrypted file content is calculated and compared against the decrypted hash. If they match, the file is authentic and intact. The file is then served to the user for download.

---

## 🚀 Technology Stack

| Area      | Technology                                                                                                    |
| :-------- | :------------------------------------------------------------------------------------------------------------ |
| **Frontend**  | React (Vite), Zustand, Axios, Tailwind CSS, Framer Motion, React Router, React Dropzone, Lucide React, WebCrypto API |
| **Backend**   | Node.js, Express.js, MongoDB (with Mongoose), JSON Web Tokens (JWT), Multer, Nodemailer, bcryptjs, CORS, Dotenv |
| **Tooling**   | Git, npm / yarn                                                                                               |

---

## 🛠️ Getting Started: Installation & Setup

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [MongoDB](https://www.mongodb.com/try/download/community) instance (local or a cloud service like MongoDB Atlas)
-   [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/securefilevault.git
cd securefilevault
```

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file in the /backend directory
```
Now, open the newly created .env file and add the following environment variables. Replace the placeholder values with your own.

### 3. .env (Backend)
```bash
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/<db-name>?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_super_secret_and_long_jwt_key_that_is_hard_to_guess

# Nodemailer Configuration (for email verification and password resets)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Client URL (for links in emails)
CLIENT_URL=http://localhost:5173
```

### 4. FrontEnd Setup
```bash
# Navigate to the frontend directory from the root
cd frontend

# Install dependencies
npm install

# The frontend uses Vite, which handles environment variables differently.
# No .env file is needed for local development as long as the backend runs on port 5000.
# The API URL is configured in `fileStore.js` and `authStore.js` to switch automatically.
```
