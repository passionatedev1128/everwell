import nodemailer from 'nodemailer';

// Create transporter based on email provider
const createTransporter = () => {
  const emailProvider = process.env.EMAIL_PROVIDER?.toLowerCase() || 'gmail';
  
  // Common SMTP configurations
  const configs = {
    gmail: {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD // Gmail requires App Password
      },
      // Connection timeout settings (increased)
      connectionTimeout: 30000, // 30 seconds
      greetingTimeout: 30000,
      socketTimeout: 30000,
      // Retry settings
      pool: true,
      maxConnections: 1,
      maxMessages: 3,
      // Gmail specific settings
      tls: {
        rejectUnauthorized: false
      },
      // Debug (set to true for troubleshooting)
      debug: process.env.NODE_ENV === 'development',
      logger: process.env.NODE_ENV === 'development'
    },
    outlook: {
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3'
      }
    },
    hotmail: {
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    },
    yahoo: {
      host: 'smtp.mail.yahoo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    },
    custom: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    }
  };

  const config = configs[emailProvider] || configs.custom;

  return nodemailer.createTransport(config);
};

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email service configured successfully');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    return false;
  }
};

// Send email with retry mechanism
export const sendEmail = async ({ to, subject, html, text, attachments }, retries = 2) => {
  try {
    // Don't send emails if email is not configured
    const hasPassword = process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD;
    if (!process.env.EMAIL_USER || !hasPassword) {
      console.warn('⚠️ Email not configured. Skipping email send.');
      console.warn('   Set EMAIL_USER and EMAIL_APP_PASSWORD (or EMAIL_PASSWORD) in .env');
      return { success: false, message: 'Email not configured' };
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"EverWell" <${process.env.EMAIL_USER}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Plain text fallback
      ...(attachments && { attachments })
    };

    // Retry logic for connection timeouts
    let lastError;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent to ${to}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
      } catch (error) {
        lastError = error;
        // Only retry on connection/timeout errors
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET' || error.code === 'ESOCKET') {
          if (attempt < retries) {
            const delay = (attempt + 1) * 2000; // 2s, 4s delays
            console.warn(`⚠️ Connection error (attempt ${attempt + 1}/${retries + 1}). Retrying in ${delay/1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
        throw error; // Re-throw if not a retryable error or out of retries
      }
    }
    
    throw lastError;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    
    // Provide helpful error messages
    if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET') {
      console.error('💡 Troubleshooting tips:');
      console.error('   1. Check your internet connection');
      console.error('   2. Check if your firewall/antivirus is blocking SMTP (ports 587, 465)');
      console.error('   3. Try a different network (some ISPs block SMTP)');
      console.error('   4. Verify Gmail App Password is correct');
      console.error('   5. Check if Gmail account has 2-Step Verification enabled');
    } else if (error.code === 'EAUTH') {
      console.error('💡 Authentication failed. Check:');
      console.error('   1. EMAIL_USER is correct');
      console.error('   2. EMAIL_APP_PASSWORD is correct (16 characters, no spaces)');
      console.error('   3. Gmail account has 2-Step Verification enabled');
    }
    
    return { success: false, error: error.message, code: error.code };
  }
};

export default { sendEmail, verifyEmailConfig };

