# PowerShell script to unblock SMTP ports in Windows Firewall
# Run as Administrator: Right-click → "Run with PowerShell" → Select "Yes" when prompted

Write-Host "🔥 SMTP Firewall Fix Script" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "   Right-click this file and select 'Run with PowerShell'" -ForegroundColor Yellow
    Write-Host "   Or run PowerShell as Administrator and execute this script" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green
Write-Host ""

# Function to create firewall rule
function Create-FirewallRule {
    param(
        [string]$Name,
        [int]$Port,
        [string]$Direction = "Outbound"
    )
    
    Write-Host "Creating rule: $Name (Port $Port)..." -ForegroundColor Yellow
    
    # Check if rule already exists
    $existingRule = Get-NetFirewallRule -DisplayName $Name -ErrorAction SilentlyContinue
    
    if ($existingRule) {
        Write-Host "⚠️  Rule '$Name' already exists. Removing old rule..." -ForegroundColor Yellow
        Remove-NetFirewallRule -DisplayName $Name -ErrorAction SilentlyContinue
    }
    
    # Create new rule
    try {
        New-NetFirewallRule -DisplayName $Name `
            -Direction $Direction `
            -Protocol TCP `
            -LocalPort $Port `
            -Action Allow `
            -Profile Domain,Private,Public `
            -Description "Allow SMTP connection to Gmail on port $Port" | Out-Null
        
        Write-Host "✅ Created firewall rule: $Name" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Failed to create rule: $_" -ForegroundColor Red
        return $false
    }
}

# Create rules for both SMTP ports
Write-Host "Creating firewall rules for SMTP ports..." -ForegroundColor Cyan
Write-Host ""

$rule1 = Create-FirewallRule -Name "SMTP Gmail Port 587" -Port 587
$rule2 = Create-FirewallRule -Name "SMTP Gmail Port 465" -Port 465

Write-Host ""
Write-Host "=" * 60
Write-Host ""

if ($rule1 -and $rule2) {
    Write-Host "✅ Firewall rules created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Restart your Node.js server" -ForegroundColor White
    Write-Host "   2. Run: node scripts/diagnose-smtp.js" -ForegroundColor White
    Write-Host "   3. Test email sending: node scripts/test-gmail.js" -ForegroundColor White
} else {
    Write-Host "⚠️  Some rules may not have been created. Check manually:" -ForegroundColor Yellow
    Write-Host "   - Open Windows Firewall (wf.msc)" -ForegroundColor White
    Write-Host "   - Check Outbound Rules" -ForegroundColor White
    Write-Host "   - Look for 'SMTP Gmail Port 587' and 'SMTP Gmail Port 465'" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

