export const VERIFICATION_EMAIL_TEMPLATE = `

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your SecureFileVault Account</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f5; /* zinc-100 */
    }
    table {
      border-spacing: 0;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f4f4f5; /* zinc-100 */
      padding-bottom: 60px;
    }
    .main {
      background-color: #ffffff;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-spacing: 0;
      font-family: 'Inter', sans-serif, Arial;
      color: #3f3f46; /* zinc-700 */
    }
    .two-columns {
      text-align: center;
      font-size: 0;
    }
    .two-columns .column {
      width: 100%;
      max-width: 300px;
      display: inline-block;
      vertical-align: top;
    }
  </style>
</head>
<body>

  <!-- This is a preheader. It's the short summary text that follows the subject line in an email client. -->
  <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    Your SecureFileVault verification code is inside.
  </div>

  <center class="wrapper">
    <table class="main" width="100%">
      
      

      <!-- BODY -->
      <tr>
        <td style="padding: 40px 30px;">
          <h2 style="font-size: 24px; font-weight: bold; color: #18181b; margin-top: 0;">Confirm Your Email</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Hello {name},</p>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Thank you for signing up for SecureFileVault. To complete your registration, please use the following verification code:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #14b8a6; background-color: #f0fdfa; padding: 15px 20px; border-radius: 8px; display: inline-block;">{verificationCode}</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">This code is valid for the next 15 minutes. Please enter it on the verification page in the app.</p>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">If you did not request this, you can safely ignore this email.</p>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Best regards,<br>The SecureFileVault Team</p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background-color: #27272a; padding: 30px 20px; text-align: center;">
          <p style="font-size: 12px; color: #a1a1aa;">© 2025 SecureFileVault. All Rights Reserved.</p>
          <p style="font-size: 12px; color: #a1a1aa;">This is a transactional email. Please do not reply.</p>
        </td>
      </tr>

    </table>
  </center>

</body>
</html>

`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your SecureFileVault Password Has Been Reset</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f5; /* zinc-100 */
    }
    table {
      border-spacing: 0;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f4f4f5; /* zinc-100 */
      padding-bottom: 60px;
    }
    .main {
      background-color: #ffffff;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-spacing: 0;
      font-family: 'Inter', sans-serif, Arial;
      color: #3f3f46; /* zinc-700 */
    }
    .two-columns {
      text-align: center;
      font-size: 0;
    }
    .two-columns .column {
      width: 100%;
      max-width: 300px;
      display: inline-block;
      vertical-align: top;
    }
    .button {
        background-color: #14b8a6; /* teal-500 */
        color: #ffffff;
        text-decoration: none;
        padding: 14px 28px;
        border-radius: 8px;
        font-weight: bold;
        display: inline-block;
    }
  </style>
</head>
<body>

  <!-- Preheader text -->
  <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    Your password has been successfully changed.
  </div>

  <center class="wrapper">
    <table class="main" width="100%">
      
      
      <!-- BODY -->
      <tr>
        <td style="padding: 40px 30px;">
          <h2 style="font-size: 24px; font-weight: bold; color: #18181b; margin-top: 0;">Password Changed Successfully</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Hello {name},</p>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">This is a confirmation that the password for your SecureFileVault account has been successfully changed. You can now log in using your new password.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f0fdfa; border: 2px solid #ccfbf1; color: #14b8a6; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; display: inline-block; font-size: 32px; font-weight: bold;">
              ✓
            </div>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #52525b; font-weight: bold;">If you did not make this change, please secure your account immediately by resetting your password again and contacting our support team.</p>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Thank you for helping us keep your account secure.</p>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Best regards,<br>The SecureFileVault Team</p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background-color: #27272a; padding: 30px 20px; text-align: center;">
          <p style="font-size: 12px; color: #a1a1aa;">© 2025 SecureFileVault. All Rights Reserved.</p>
          <p style="font-size: 12px; color: #a1a1aa;">This is a transactional email. Please do not reply.</p>
        </td>
      </tr>

    </table>
  </center>

</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your SecureFileVault Password</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f5; /* zinc-100 */
    }
    table {
      border-spacing: 0;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f4f4f5; /* zinc-100 */
      padding-bottom: 60px;
    }
    .main {
      background-color: #ffffff;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-spacing: 0;
      font-family: 'Inter', sans-serif, Arial;
      color: #3f3f46; /* zinc-700 */
    }
    .two-columns {
      text-align: center;
      font-size: 0;
    }
    .two-columns .column {
      width: 100%;
      max-width: 300px;
      display: inline-block;
      vertical-align: top;
    }
    .button {
        background-color: #14b8a6; /* teal-500 */
        color: #ffffff;
        text-decoration: none;
        padding: 14px 28px;
        border-radius: 8px;
        font-weight: bold;
        display: inline-block;
    }
  </style>
</head>
<body>

  <!-- Preheader text -->
  <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    A request was made to reset your password.
  </div>

  <center class="wrapper">
    <table class="main" width="100%">
      
      

      <!-- BODY -->
      <tr>
        <td style="padding: 40px 30px;">
          <h2 style="font-size: 24px; font-weight: bold; color: #18181b; margin-top: 0;">Password Reset Request</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Hello {name},</p>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">We received a request to reset the password associated with your SecureFileVault account. If you made this request, please click the button below to set a new password.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{resetURL}" target="_blank" class="button">Reset Your Password</a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">This link is valid for 1 hour. If you did not request a password reset, you can safely disregard this email.</p>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Best regards,<br>The SecureFileVault Team</p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background-color: #27272a; padding: 30px 20px; text-align: center;">
          <p style="font-size: 12px; color: #a1a1aa;">© 2025 SecureFileVault. All Rights Reserved.</p>
          <p style="font-size: 12px; color: #a1a1aa;">This is a transactional email. Please do not reply.</p>
        </td>
      </tr>

    </table>
  </center>

</body>
</html>
`;

export const WELCOME_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to SecureFileVault!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f5; /* zinc-100 */
    }
    table {
      border-spacing: 0;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f4f4f5; /* zinc-100 */
      padding-bottom: 60px;
    }
    .main {
      background-color: #ffffff;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-spacing: 0;
      font-family: 'Inter', sans-serif, Arial;
      color: #3f3f46; /* zinc-700 */
    }
    .button {
        background-color: #14b8a6; /* teal-500 */
        color: #ffffff;
        text-decoration: none;
        padding: 14px 28px;
        border-radius: 8px;
        font-weight: bold;
        display: inline-block;
    }
    .security-note {
        background-color: #fefce8; /* yellow-50 */
        border-left: 4px solid #facc15; /* yellow-400 */
        padding: 16px;
        margin-top: 24px;
        font-size: 14px;
        line-height: 1.6;
        color: #71717a; /* zinc-500 */
    }
  </style>
</head>
<body>

  <!-- Preheader text for inbox preview -->
  <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    Welcome! Your end-to-end encrypted storage is ready.
  </div>

  <center class="wrapper">
    <table class="main" width="100%">
      

      <!-- BODY -->
      <tr>
        <td style="padding: 40px 30px;">
          <h2 style="font-size: 24px; font-weight: bold; color: #18181b; margin-top: 0;">Welcome to SecureFileVault!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Hello {name},</p>
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">We're thrilled to have you on board. Your account has been successfully created, and you're now ready to start securing your important files with zero-knowledge, end-to-end encryption.</p>

          <div class="security-note">
            <strong>Important Next Step:</strong> Before you upload, you'll need to generate or provide your personal RSA key pair. This is a crucial step to ensure that only you—and no one else—can ever access your encrypted data.
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #52525b; margin-top: 24px;">Click the button below to go to your dashboard and get started.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="{appURL}" target="_blank" class="button">Access Your Vault</a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #52525b;">Best regards,<br>The SecureFileVault Team</p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background-color: #27272a; padding: 30px 20px; text-align: center;">
          <p style="font-size: 12px; color: #a1a1aa;">© 2025 SecureFileVault. All Rights Reserved.</p>
          <p style="font-size: 12px; color: #a1a1aa;">You are receiving this email because you signed up for an account on SecureFileVault.</p>
        </td>
      </tr>

    </table>
  </center>

</body>
</html>
`