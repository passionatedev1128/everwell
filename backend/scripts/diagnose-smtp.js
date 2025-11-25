import net from 'net';
import dns from 'dns';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const lookup = promisify(dns.lookup);

// Test port connectivity
async function testPort(host, port, timeout = 5000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let connected = false;

    const onConnect = () => {
      connected = true;
      socket.destroy();
      resolve({ success: true, message: `Port ${port} is accessible` });
    };

    const onError = (error) => {
      if (!connected) {
        resolve({ 
          success: false, 
          message: `Port ${port} is blocked or unreachable: ${error.message}` 
        });
      }
    };

    const onTimeout = () => {
      socket.destroy();
      resolve({ 
        success: false, 
        message: `Port ${port} connection timeout (may be blocked by firewall)` 
      });
    };

    socket.setTimeout(timeout);
    socket.once('connect', onConnect);
    socket.once('error', onError);
    socket.once('timeout', onTimeout);

    try {
      socket.connect(port, host);
    } catch (error) {
      resolve({ 
        success: false, 
        message: `Failed to connect to ${host}:${port}: ${error.message}` 
      });
    }
  });
}

// Test DNS resolution
async function testDNS(hostname) {
  try {
    const { address } = await lookup(hostname);
    return { success: true, message: `DNS resolved: ${hostname} -> ${address}` };
  } catch (error) {
    return { success: false, message: `DNS resolution failed: ${error.message}` };
  }
}

// Test SMTP connection with nodemailer
async function testSMTPConnection() {
  try {
    const emailModule = await import('../config/email.js');
    // Access the internal createTransporter function
    const nodemailer = (await import('nodemailer')).default;
    
    // Create transporter manually for testing
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000
    });
    
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        transporter.close();
        resolve({
          success: false,
          message: 'SMTP connection timeout (30s) - likely blocked by firewall or network'
        });
      }, 30000);

      transporter.verify((error, success) => {
        clearTimeout(timeout);
        transporter.close();
        
        if (error) {
          resolve({
            success: false,
            message: `SMTP connection failed: ${error.message}`,
            code: error.code
          });
        } else {
          resolve({
            success: true,
            message: 'SMTP connection successful!'
          });
        }
      });
    });
  } catch (error) {
    return {
      success: false,
      message: `Failed to test SMTP: ${error.message}`
    };
  }
}

async function diagnoseSMTP() {
  console.log('🔍 SMTP Connectivity Diagnostic Tool\n');
  console.log('=' .repeat(60));
  console.log('Testing Gmail SMTP connectivity...\n');

  const hostname = 'smtp.gmail.com';
  const ports = [587, 465];

  // Test 1: DNS Resolution
  console.log('📡 Test 1: DNS Resolution');
  console.log('-'.repeat(60));
  const dnsResult = await testDNS(hostname);
  console.log(dnsResult.success ? `✅ ${dnsResult.message}` : `❌ ${dnsResult.message}`);
  console.log('');

  if (!dnsResult.success) {
    console.log('⚠️  DNS resolution failed. Check your internet connection.\n');
    return;
  }

  // Test 2: Port Connectivity
  console.log('🔌 Test 2: Port Connectivity');
  console.log('-'.repeat(60));
  
  for (const port of ports) {
    console.log(`Testing port ${port}...`);
    const portResult = await testPort(hostname, port, 10000);
    console.log(portResult.success ? `✅ ${portResult.message}` : `❌ ${portResult.message}`);
  }
  console.log('');

  // Test 3: SMTP Connection (Full)
  console.log('📧 Test 3: Full SMTP Connection');
  console.log('-'.repeat(60));
  
  // Check if email is configured
  const hasPassword = process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD;
  if (!process.env.EMAIL_USER || !hasPassword) {
    console.log('⚠️  Email not configured. Skipping SMTP connection test.');
    console.log('   Set EMAIL_USER and EMAIL_APP_PASSWORD in .env to test full connection.\n');
  } else {
    console.log(`Using: ${process.env.EMAIL_USER}`);
    console.log('Attempting SMTP connection (this may take up to 30 seconds)...');
    const smtpResult = await testSMTPConnection();
    console.log(smtpResult.success ? `✅ ${smtpResult.message}` : `❌ ${smtpResult.message}`);
    if (smtpResult.code) {
      console.log(`   Error code: ${smtpResult.code}`);
    }
    console.log('');
  }

  // Summary and Recommendations
  console.log('📋 Summary & Recommendations');
  console.log('='.repeat(60));
  
  const allPortsBlocked = ports.every(async (port) => {
    const result = await testPort(hostname, port, 5000);
    return !result.success;
  });

  if (!dnsResult.success) {
    console.log('❌ DNS resolution failed - check your internet connection');
  } else {
    const port587 = await testPort(hostname, 587, 5000);
    const port465 = await testPort(hostname, 465, 5000);
    
    if (!port587.success && !port465.success) {
      console.log('⚠️  Both SMTP ports (587 and 465) appear to be blocked.');
      console.log('');
      console.log('💡 Possible causes:');
      console.log('   1. Firewall is blocking SMTP ports');
      console.log('      → Check Windows Firewall settings');
      console.log('      → Check antivirus software firewall');
      console.log('      → Allow ports 587 and 465 in firewall rules');
      console.log('');
      console.log('   2. ISP/Network is blocking SMTP');
      console.log('      → Some ISPs block outbound SMTP connections');
      console.log('      → Try connecting from a different network');
      console.log('      → Try using a VPN');
      console.log('      → Contact your network administrator');
      console.log('');
      console.log('   3. Corporate/Institutional firewall');
      console.log('      → Contact IT department to whitelist smtp.gmail.com');
      console.log('      → Request access to ports 587 and 465');
      console.log('');
    } else if (!port587.success) {
      console.log('⚠️  Port 587 is blocked, but port 465 may work');
      console.log('   → Consider using port 465 (SSL) instead');
    } else if (!port465.success) {
      console.log('⚠️  Port 465 is blocked, but port 587 works');
      console.log('   → Current configuration should work');
    } else {
      console.log('✅ Both ports are accessible');
      console.log('   → Network connectivity looks good');
      console.log('   → If emails still fail, check authentication settings');
    }
  }

  console.log('');
  console.log('🔧 Next Steps:');
  console.log('   1. If ports are blocked, configure firewall to allow SMTP');
  console.log('   2. If on a restricted network, try a different network or VPN');
  console.log('   3. Verify EMAIL_APP_PASSWORD is correct (16 characters)');
  console.log('   4. Ensure Gmail account has 2-Step Verification enabled');
  console.log('');
}

// Run diagnostics
diagnoseSMTP().catch(error => {
  console.error('❌ Diagnostic error:', error);
  process.exit(1);
});

