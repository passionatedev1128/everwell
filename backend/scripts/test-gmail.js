import dotenv from 'dotenv';
import { sendEmail, verifyEmailConfig } from '../config/email.js';

dotenv.config();

async function testGmail() {
  console.log('🧪 Testing Gmail Integration...\n');

  // Check environment variables
  console.log('📋 Checking environment variables:');
  console.log(`   EMAIL_PROVIDER: ${process.env.EMAIL_PROVIDER || 'not set'}`);
  console.log(`   EMAIL_USER: ${process.env.EMAIL_USER || 'not set'}`);
  console.log(`   EMAIL_APP_PASSWORD: ${process.env.EMAIL_APP_PASSWORD ? '***set***' : 'not set'}`);
  console.log(`   EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '***set***' : 'not set'}\n`);

  if (!process.env.EMAIL_USER) {
    console.error('❌ ERROR: EMAIL_USER is not set in .env file');
    console.log('\n📝 Please add to backend/.env:');
    console.log('   EMAIL_PROVIDER=gmail');
    console.log('   EMAIL_USER=your-email@gmail.com');
    console.log('   EMAIL_APP_PASSWORD=your-16-char-app-password');
    process.exit(1);
  }

  // Verify email configuration
  console.log('🔍 Verifying email configuration...');
  const verified = await verifyEmailConfig();
  
  if (!verified) {
    console.error('\n❌ Email configuration verification failed!');
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure you have enabled 2-Step Verification on your Google Account');
    console.log('   2. Generate an App Password:');
    console.log('      - Go to: https://myaccount.google.com/apppasswords');
    console.log('      - Select "Mail" and "Other (Custom name)"');
    console.log('      - Enter "EverWell" as the name');
    console.log('      - Copy the 16-character password');
    console.log('   3. Add EMAIL_APP_PASSWORD to your .env file (without spaces)');
    console.log('   4. Make sure EMAIL_PROVIDER=gmail in .env');
    process.exit(1);
  }

  console.log('✅ Email configuration verified!\n');

  // Test sending email
  const testEmail = process.env.TEST_EMAIL || process.env.EMAIL_USER;
  console.log(`📧 Sending test email to: ${testEmail}`);
  
  try {
    const result = await sendEmail({
      to: testEmail,
      subject: '🧪 Gmail Integration Test - EverWell',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4fb3a8; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fdfc; padding: 30px; border-radius: 0 0 8px 8px; }
            .success-box { background: #52c41a; color: white; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>EverWell</h1>
            </div>
            <div class="content">
              <div class="success-box">
                <h2>✅ Gmail Integration Successful!</h2>
              </div>
              <p>Congratulations! Your Gmail integration is working correctly.</p>
              <p>This is a test email sent from the EverWell application.</p>
              <p><strong>Test Details:</strong></p>
              <ul>
                <li>Provider: Gmail</li>
                <li>From: ${process.env.EMAIL_USER}</li>
                <li>Time: ${new Date().toLocaleString('pt-BR')}</li>
              </ul>
              <p>You can now receive emails for:</p>
              <ul>
                <li>User registration</li>
                <li>Authorization notifications</li>
                <li>Document upload confirmations</li>
                <li>Order status updates</li>
              </ul>
              <p>Equipe EverWell</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Gmail Integration Test - EverWell
        
        Congratulations! Your Gmail integration is working correctly.
        
        This is a test email sent from the EverWell application.
        
        Test Details:
        - Provider: Gmail
        - From: ${process.env.EMAIL_USER}
        - Time: ${new Date().toLocaleString('pt-BR')}
        
        You can now receive emails for:
        - User registration
        - Authorization notifications
        - Document upload confirmations
        - Order status updates
        
        Equipe EverWell
      `
    });

    if (result.success) {
      console.log('✅ Test email sent successfully!');
      console.log(`   Message ID: ${result.messageId}`);
      console.log(`\n📬 Check your inbox at: ${testEmail}`);
      console.log('   (Also check spam folder if not received)');
    } else {
      console.error('❌ Failed to send test email:', result.error || result.message);
    }
  } catch (error) {
    console.error('❌ Error sending test email:', error.message);
    console.error('\n💡 Common issues:');
    console.error('   - Invalid app password');
    console.error('   - 2-Step Verification not enabled');
    console.error('   - App password not set correctly in .env');
  }
}

testGmail();

