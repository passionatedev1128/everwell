# 🔥 Firewall Fix Guide - SMTP Port Blocking

## ⚠️ Issue Detected

The diagnostic tool has confirmed that **both SMTP ports (587 and 465) are blocked** on your system. This is preventing email from being sent.

## 🔍 Diagnostic Results

- ✅ DNS Resolution: Working (smtp.gmail.com resolves correctly)
- ❌ Port 587: **BLOCKED** (connection timeout)
- ❌ Port 465: **BLOCKED** (connection timeout)

## 🛠️ Solution: Unblock SMTP Ports

### Option 1: Windows Firewall (Recommended)

#### Step 1: Open Windows Firewall
1. Press `Win + R` to open Run dialog
2. Type `wf.msc` and press Enter
3. Or search "Windows Defender Firewall with Advanced Security" in Start menu

#### Step 2: Create Outbound Rule for Port 587
1. Click **"Outbound Rules"** in the left panel
2. Click **"New Rule..."** in the right panel
3. Select **"Port"** → Click **Next**
4. Select **"TCP"**
5. Select **"Specific local ports"** and enter: `587`
6. Click **Next**
7. Select **"Allow the connection"** → Click **Next**
8. Check all profiles (Domain, Private, Public) → Click **Next**
9. Name it: `SMTP Gmail Port 587` → Click **Finish**

#### Step 3: Create Outbound Rule for Port 465
1. Repeat steps above, but use port `465`
2. Name it: `SMTP Gmail Port 465`

#### Step 4: Create Rule for smtp.gmail.com (Alternative)
1. Click **"Outbound Rules"** → **"New Rule..."**
2. Select **"Program"** → Click **Next**
3. Select **"This program path"** and browse to your Node.js executable:
   - Usually: `C:\Program Files\nodejs\node.exe`
   - Or: `C:\Users\YourUsername\AppData\Roaming\npm\node.exe`
4. Click **Next**
5. Select **"Allow the connection"** → Click **Next**
6. Check all profiles → Click **Next**
7. Name it: `Node.js SMTP Access` → Click **Finish**

### Option 2: Antivirus Firewall

If you have third-party antivirus software (Norton, McAfee, Kaspersky, etc.):

1. Open your antivirus software
2. Look for **"Firewall"** or **"Network Protection"** settings
3. Find **"Application Rules"** or **"Program Rules"**
4. Add Node.js as an allowed application
5. Or add ports 587 and 465 to allowed ports

**Common Antivirus Locations:**
- **Norton**: Settings → Firewall → Program Rules
- **McAfee**: Firewall → Program Permissions
- **Kaspersky**: Settings → Protection → Firewall → Applications
- **Avast**: Protection → Firewall → Application Rules

### Option 3: Router/Network Firewall

If you're on a corporate network or behind a router firewall:

1. **Contact your IT department** to whitelist:
   - Host: `smtp.gmail.com`
   - Ports: `587` and `465`
   - Protocol: `TCP`

2. **For home router:**
   - Access router admin panel (usually `192.168.1.1` or `192.168.0.1`)
   - Look for **"Firewall"** or **"Port Forwarding"** settings
   - Add outbound rules for ports 587 and 465

### Option 4: ISP Blocking

Some ISPs block SMTP ports. Solutions:

1. **Contact your ISP** to request SMTP access
2. **Use a VPN** to bypass ISP restrictions
3. **Use a different network** (mobile hotspot, different WiFi)
4. **Use an alternative email service** that uses different ports

## ✅ Verify the Fix

After making changes, run the diagnostic again:

```bash
cd backend
node scripts/diagnose-smtp.js
```

You should see:
- ✅ Port 587 is accessible
- ✅ Port 465 is accessible (or at least one of them)

## 🧪 Test Email Sending

Once ports are unblocked, test email sending:

```bash
cd backend
node scripts/test-gmail.js
```

## 🔄 Alternative: Use Different Email Provider

If you cannot unblock ports, consider using:

1. **SendGrid** (port 587, often not blocked)
2. **Mailgun** (port 587, often not blocked)
3. **Amazon SES** (port 587, often not blocked)
4. **Outlook/Hotmail** (may use different ports)

Update your `.env`:
```env
EMAIL_PROVIDER=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

## 📝 Quick PowerShell Test

Test if ports are accessible after firewall changes:

```powershell
# Test port 587
Test-NetConnection -ComputerName smtp.gmail.com -Port 587

# Test port 465
Test-NetConnection -ComputerName smtp.gmail.com -Port 465
```

If `TcpTestSucceeded: True`, the port is accessible!

## 🆘 Still Having Issues?

1. **Restart your computer** after firewall changes
2. **Check Windows Event Viewer** for firewall logs:
   - `Win + R` → `eventvwr.msc`
   - Windows Logs → Security
3. **Temporarily disable firewall** to test (not recommended for production)
4. **Check if Node.js is in firewall exceptions**

---

**Note:** After unblocking ports, restart your Node.js server for changes to take effect.

