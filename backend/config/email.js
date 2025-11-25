import nodemailer from 'nodemailer';

// Create transporter based on email provider
const createTransporter = () => {
  const emailProvider = process.env.EMAIL_PROVIDER?.toLowerCase() || 'gmail';
  
  // Common SMTP configurations
  const configs = {
    gmail: {
      // Try explicit SMTP settings first (more reliable in some network environments)
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD // Gmail requires App Password
      },
      // Connection timeout settings (increased for better reliability)
      connectionTimeout: 30000, // 30 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 30000, // 30 seconds
      // Retry settings
      pool: true,
      maxConnections: 1,
      maxMessages: 3,
      // Gmail specific settings
      tls: {
        rejectUnauthorized: false, // Set to false to avoid certificate issues in some environments
        minVersion: 'TLSv1.2'
      },
      // Additional connection options
      requireTLS: true,
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

// Verify email configuration (runs in background, doesn't block startup)
export const verifyEmailConfig = async () => {
  try {
    // Check if email is configured before attempting verification
    const hasPassword = process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD;
    if (!process.env.EMAIL_USER || !hasPassword) {
      console.warn('⚠️ Email not configured. Email features will be disabled.');
      console.warn('   Set EMAIL_USER and EMAIL_APP_PASSWORD (or EMAIL_PASSWORD) in .env to enable email');
      return false;
    }

    const transporter = createTransporter();
    
    // Set a shorter timeout for verification (5 seconds)
    const verifyPromise = transporter.verify();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Verification timeout')), 5000) // 5 second timeout
    );
    
    await Promise.race([verifyPromise, timeoutPromise]);
    console.log('✅ Email service configured successfully');
    return true;
  } catch (error) {
    // Don't block server startup if email verification fails
    if (error.message === 'Verification timeout') {
      // Only show warning in development, and make it less alarming
      if (process.env.NODE_ENV === 'development') {
        console.log('ℹ️  Email connection test timed out (this is normal if firewall blocks SMTP).');
        console.log('   Email sending will still be attempted when needed.');
      }
    } else {
      console.warn('⚠️ Email configuration issue:', error.message);
      console.warn('   Email features may not work. Check your EMAIL_USER and EMAIL_APP_PASSWORD settings.');
    }
    return false;
  }
};

// Send email with retry mechanism and timeout
export const sendEmail = async ({ to, subject, html, text, attachments }, retries = 1) => {
  try {
    // Don't send emails if email is not configured
    const hasPassword = process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD;
    if (!process.env.EMAIL_USER || !hasPassword) {
      console.warn('⚠️ Email not configured. Skipping email send.');
      console.warn('   Set EMAIL_USER and EMAIL_APP_PASSWORD (or EMAIL_PASSWORD) in .env');
      return { success: false, message: 'Email not configured' };
    }

    const mailOptions = {
      from: `"EverWell" <${process.env.EMAIL_USER}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Plain text fallback
      ...(attachments && { attachments })
    };

    // Retry logic with timeout wrapper
    let lastError;
    const EMAIL_TIMEOUT = 45000; // 45 seconds max per attempt (allows for slow connections)
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      let transporter;
      try {
        // Create a fresh transporter for each attempt to avoid stale connections
        transporter = createTransporter();
        
        // Wrap sendMail in a timeout promise
        const sendPromise = transporter.sendMail(mailOptions);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email send timeout')), EMAIL_TIMEOUT)
        );
        
        const info = await Promise.race([sendPromise, timeoutPromise]);
        
        // Close transporter on success
        transporter.close();
        
        console.log(`📧 Email sent to ${to}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
      } catch (error) {
        lastError = error;
        
        // Close transporter on error
        if (transporter) {
          try {
            transporter.close();
          } catch (closeError) {
            // Ignore close errors
          }
        }
        
        // Check if it's a timeout or connection error
        const isTimeoutError = error.message === 'Email send timeout' || 
                               error.message?.includes('timeout') ||
                               error.code === 'ETIMEDOUT' || 
                               error.code === 'ECONNRESET' || 
                               error.code === 'ESOCKET';
        
        if (isTimeoutError) {
          if (attempt < retries) {
            const delay = (attempt + 1) * 2000; // 2s, 4s delays (increased)
            console.warn(`⚠️ Connection timeout (attempt ${attempt + 1}/${retries + 1}). Retrying in ${delay/1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          } else {
            // Final attempt failed
            console.error(`❌ Failed to send verification email to ${to}: Connection timeout`);
            return { 
              success: false, 
              error: 'Connection timeout', 
              code: 'ETIMEDOUT',
              message: 'The verification link can\'t be sent to your email due to connection timeout. Please check your internet connection and firewall settings.'
            };
          }
        }
        
        // For non-timeout errors, throw immediately
        throw error;
      }
    }
    
    throw lastError;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    
    // Provide helpful error messages
    if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET' || error.message === 'Email send timeout') {
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
    
    return { 
      success: false, 
      error: error.message, 
      code: error.code,
      message: error.message === 'Email send timeout' 
        ? 'The verification link can\'t be sent to your email due to connection timeout.'
        : 'The verification link can\'t be sent to your email.'
    };
  }
};

export default { sendEmail, verifyEmailConfig };

