import nodemailer from 'nodemailer';

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Creates a configured Nodemailer transporter using Gmail SMTP
 */
export function createEmailTransporter() {
  const user = process.env.GMAIL_USER || 'northstackdigitals@gmail.com';
  const pass = process.env.GMAIL_APP_PASSWORD || '';

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Sends a stylized, secure 6-digit OTP verification email
 */
export async function sendOtpEmail(
  toEmail: string,
  otpCode: string,
  expiresInMinutes: number = 5
): Promise<SendEmailResult> {
  const user = process.env.GMAIL_USER || 'northstackdigitals@gmail.com';
  const pass = process.env.GMAIL_APP_PASSWORD;
  const appName = process.env.APP_NAME || 'NorthStack Digitals';

  // If running in development without credentials, log OTP for instant local testing
  if (!pass || pass.includes('placeholder')) {
    console.log(`\n======================================================`);
    console.log(`[SIMULATED EMAIL DISPATCH]`);
    console.log(`To: ${toEmail}`);
    console.log(`Subject: Your ${appName} Verification Code: ${otpCode}`);
    console.log(`Verification OTP: ${otpCode} (Valid for ${expiresInMinutes} minutes)`);
    console.log(`======================================================\n`);
    return { success: true, messageId: 'simulated_local_message_id' };
  }

  const transporter = createEmailTransporter();

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #090d16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #090d16; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 36px 36px 20px; text-align: center; border-bottom: 1px solid #1e293b;">
              <table role="presentation" align="center" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #0284c7; width: 40px; height: 40px; border-radius: 10px; text-align: center; vertical-align: middle;">
                    <span style="color: #ffffff; font-weight: 900; font-size: 20px; line-height: 40px;">N</span>
                  </td>
                  <td style="padding-left: 12px; text-align: left;">
                    <div style="font-size: 16px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">NORTHSTACK</div>
                    <div style="font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #38bdf8;">DIGITALS</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 36px;">
              <h1 style="margin: 0 0 12px; font-size: 22px; font-weight: 800; color: #ffffff; text-align: center; letter-spacing: -0.5px;">
                Your Verification Code
              </h1>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 22px; color: #94a3b8; text-align: center;">
                Use the 6-digit one-time passcode below to verify your email and sign in to the NorthStack client portal.
              </p>

              <!-- OTP Code Display Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 24px;">
                <tr>
                  <td align="center">
                    <div style="background-color: #020617; border: 2px solid #0284c7; border-radius: 14px; padding: 18px 24px; display: inline-block;">
                      <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #38bdf8; padding-left: 8px;">
                        ${otpCode}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Expiry Alert -->
              <div style="background-color: rgba(2, 132, 199, 0.1); border: 1px solid rgba(2, 132, 199, 0.25); border-radius: 10px; padding: 12px 16px; margin-bottom: 24px; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #7dd3fc; font-weight: 600;">
                  ⏱️ This code will expire in <strong>${expiresInMinutes} minutes</strong>.
                </p>
              </div>

              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #64748b; text-align: center;">
                If you did not request this verification code, you can safely ignore this email. Someone may have typed your email address by mistake.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 36px 28px; background-color: #090d16; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 11px; color: #475569;">
                NorthStack Digitals • Premium Custom Software & High-Impact Digital Engineering
              </p>
              <p style="margin: 0; font-size: 11px; color: #334155;">
                https://northstackdigitals.vercel.app
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const textContent = `
NorthStack Digitals Verification Code: ${otpCode}

Use this 6-digit code to complete your login or registration.
This code will expire in ${expiresInMinutes} minutes.

If you did not request this code, please ignore this email.

NorthStack Digitals
https://northstackdigitals.vercel.app
`;

  try {
    const info = await transporter.sendMail({
      from: `"${appName}" <${user}>`,
      to: toEmail,
      subject: `${otpCode} is your NorthStack verification code`,
      text: textContent,
      html: htmlContent,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error('Nodemailer Gmail SMTP dispatch error:', error);
    return {
      success: false,
      error: error?.message || 'Failed to dispatch email via Gmail SMTP',
    };
  }
}
