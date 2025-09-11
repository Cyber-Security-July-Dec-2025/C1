# <img src="./frontend/public/SecureVaultLogo.png" alt="Logo" width="40" valign="bottom"/> SecureFileVault: A Zero-Knowledge Encrypted File Store
SecureFileVault is a modern, web-based application that allows users to store files with the guarantee of confidentiality and integrity. It employs a **zero-knowledge architecture**, meaning all cryptographic operations are performed on the client-side (in the browser). The server only ever stores encrypted data blobs, ensuring that no one, not even the server administrators, can access the original file content.

---

## How It Works: The Cryptographic Flow

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

## Technology Stack

| Area      | Technology                                                                                                    |
| :-------- | :------------------------------------------------------------------------------------------------------------ |
| **Frontend**  | React (Vite), Zustand, Axios, Tailwind CSS, Framer Motion, React Router, React Dropzone, Lucide React, WebCrypto API |
| **Backend**   | Node.js, Express.js, MongoDB (with Mongoose), JSON Web Tokens (JWT), Multer, Nodemailer, bcryptjs, CORS, Dotenv |
| **Tooling**   | Git, npm / yarn                                                                                               |

---

## Getting Started: Installation & Setup

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [MongoDB](https://www.mongodb.com/try/download/community) instance (local or a cloud service like MongoDB Atlas)
-   [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/AryanPaul3/Secure-FIle-Vault/
cd Secure-File-Vault
```

### 2. Backend Setup

```bash
# Install dependencies
npm install

# Create a .env file in the /root directory
```
Now, open the newly created .env file and add the following environment variables. Replace the placeholder values with your own.

### 3. .env Setup
```bash
MONGO_URI = 
PORT = 5000
JWT_SECRET = your_seceret_key
NODE_ENV = development
NODEMAIL_EMAIL = your-email@gmail.com
NODEMAIL_PASS = your_gmail_app_password

CLIENT_URL = http://localhost:5173
```
**Generating a Gmail App Password**
To use Nodemailer with Gmail, you need to generate a special App Password. This is a 16-digit code that gives an app permission to access your Google Account.<br>
Prerequisite: <br>
You must have 2-Step Verification enabled on your Google Account.<br>
Steps:
1. Go to your Google Account: myaccount.google.com.
2. Navigate to the Security tab on the left-hand menu.
3. Scroll down to the "How you sign in to Google" section and click on 2-Step Verification. You may need to sign in again.
4. Scroll to the very bottom of the page and click on App passwords.
5. On the App passwords page, click Select app and choose Other (Custom name).
6. Enter a name for the app, for example, SecureFileVault Dev. This is just for your reference.
7. Click the Generate button.
8. Google will display a 16-character password in a yellow box. Copy this password immediately. This is the only time you will see it.
9. Paste this 16-character password into your .env file for the NODEMAIL_PASS variable.
    Example: NODEMAIL_PASS = xxyy zzzz aaaa bbbb
10. Click Done. You can now use this password in your application.

### 4. FrontEnd Setup
```bash
# Navigate to the frontend directory from the root
cd frontend

# Install dependencies
npm install
```

### 5. Running the Application
You will need two separate terminal windows to run both the backend and frontend servers concurrently.

**Terminal 1: Start the Backend Server**
```bash
cd backend
npm run dev
```
The backend API should now be running on http://localhost:5000

**Terminal 2: Start the Frontend Development Server**
```bash
cd frontend
npm run dev
```
The frontend application should now be accessible at http://localhost:5173


