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
      // Gmail specific settings
      secure: true,
      tls: {
        rejectUnauthorized: false
      }
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

  return nodemailer.createTransporter(config);
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

// Send email
export const sendEmail = async ({ to, subject, html, text, attachments }) => {
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

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export default { sendEmail, verifyEmailConfig };

