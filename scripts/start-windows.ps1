# Windows Container Start Script
# Digital Student Registration System
#
# PowerShell script for Windows Server 2022 or Windows 10/11 Pro
# Requires Docker Desktop in Windows container mode
#
# Usage:
#   .\scripts\start-windows.ps1

#Requires -Version 5.1

# Script configuration
$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$EnvFile = Join-Path $ProjectRoot ".env.windows"
$EnvTemplate = Join-Path $ProjectRoot ".env.windows.template"
$ComposeFile = Join-Path $ProjectRoot "docker-compose.windows.yml"

# Colors
function Write-ColorOutput($ForegroundColor, $Message) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    Write-Output $Message
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Header {
    Write-Host ""
    Write-ColorOutput Cyan "╔════════════════════════════════════════════════════════════╗"
    Write-ColorOutput Cyan "║   Digital Student Registration - Windows Container        ║"
    Write-ColorOutput Cyan "╚════════════════════════════════════════════════════════════╝"
    Write-Host ""
}

function Write-Success($Message) {
    Write-ColorOutput Green "✓ $Message"
}

function Write-Info($Message) {
    Write-ColorOutput Blue "[INFO] $Message"
}

function Write-Warning($Message) {
    Write-ColorOutput Yellow "[WARNING] $Message"
}

function Write-Error($Message) {
    Write-ColorOutput Red "[ERROR] $Message"
}

# Check if running as Administrator
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Check Docker installation
function Test-Docker {
    Write-Info "Checking Docker installation..."

    try {
        $dockerVersion = docker --version
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Docker is installed: $dockerVersion"
            return $true
        }
    }
    catch {
        Write-Error "Docker is not installed or not in PATH"
        Write-Info "Install Docker Desktop for Windows from: https://www.docker.com/products/docker-desktop"
        return $false
    }
}

# Check if Docker is running
function Test-DockerRunning {
    Write-Info "Checking if Docker daemon is running..."

    try {
        $dockerInfo = docker info 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Docker daemon is running"
            return $true
        }
    }
    catch {
        Write-Error "Docker daemon is not running"
        Write-Info "Start Docker Desktop and try again"
        return $false
    }
}

# Check if Docker is in Windows container mode
function Test-WindowsContainerMode {
    Write-Info "Checking Docker container mode..."

    try {
        $dockerInfo = docker info 2>&1 | Out-String
        if ($dockerInfo -match "OSType: windows") {
            Write-Success "Docker is in Windows container mode"
            return $true
        }
        else {
            Write-Error "Docker is in Linux container mode"
            Write-Warning "Switch to Windows containers:"
            Write-Info "1. Right-click Docker Desktop tray icon"
            Write-Info "2. Click 'Switch to Windows containers...'"
            Write-Info "3. Wait for Docker to restart"
            Write-Info "4. Run this script again"
            return $false
        }
    }
    catch {
        Write-Error "Could not determine Docker container mode"
        return $false
    }
}

# Check Hyper-V
function Test-HyperV {
    Write-Info "Checking Hyper-V status..."

    try {
        $hyperv = Get-WindowsOptionalFeature -FeatureName Microsoft-Hyper-V-All -Online
        if ($hyperv.State -eq "Enabled") {
            Write-Success "Hyper-V is enabled"
            return $true
        }
        else {
            Write-Warning "Hyper-V is not enabled"
            Write-Info "Enable Hyper-V with:"
            Write-Info "  Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All"
            Write-Info "  (Requires restart)"
            return $false
        }
    }
    catch {
        Write-Warning "Could not check Hyper-V status (may not be required on Windows Server)"
        return $true
    }
}

# Create .env.windows if not exists
function Initialize-Environment {
    Write-Info "Checking environment configuration..."

    if (-Not (Test-Path $EnvFile)) {
        Write-Info "Creating .env.windows from template..."
        Copy-Item $EnvTemplate $EnvFile
        Write-Success "Created .env.windows"
    }
    else {
        Write-Success ".env.windows exists"
    }
}

# Start Docker Compose
function Start-DockerCompose {
    Write-Host ""
    Write-Info "Building and starting Docker containers..."
    Write-Warning "First build may take 10-15 minutes (downloads ~2GB base image)"
    Write-Host ""

    Set-Location $ProjectRoot

    try {
        docker-compose -f $ComposeFile up -d --build
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Docker containers started successfully"
            return $true
        }
        else {
            Write-Error "Failed to start Docker containers"
            return $false
        }
    }
    catch {
        Write-Error "Error starting Docker Compose: $_"
        return $false
    }
}

# Wait for services
function Wait-ForServices {
    Write-Host ""
    Write-Info "Waiting for services to be ready..."
    Start-Sleep -Seconds 15
}

# Show status
function Show-Status {
    Write-Host ""
    Write-Info "Container status:"
    docker-compose -f $ComposeFile ps
    Write-Host ""
}

# Show success message
function Show-SuccessMessage {
    Write-Host ""
    Write-ColorOutput Green "╔════════════════════════════════════════════════════════════╗"
    Write-ColorOutput Green "║   Windows Container Environment Ready!                     ║"
    Write-ColorOutput Green "╚════════════════════════════════════════════════════════════╝"
    Write-Host ""
    Write-Host "  Application:  http://localhost:3000"
    Write-Host ""
    Write-ColorOutput Yellow "Useful Commands:"
    Write-Host "  View logs:    docker-compose -f docker-compose.windows.yml logs -f"
    Write-Host "  Stop:         docker-compose -f docker-compose.windows.yml down"
    Write-Host "  Clean:        docker-compose -f docker-compose.windows.yml down -v"
    Write-Host ""
    Write-ColorOutput Green "✓ Setup complete! Open http://localhost:3000 in your browser"
    Write-Host ""
}

# Main execution
function Main {
    Write-Header

    # Check administrator
    if (-Not (Test-Administrator)) {
        Write-Warning "Not running as Administrator"
        Write-Info "Some checks may fail without admin privileges"
        Write-Host ""
    }

    # Run checks
    if (-Not (Test-Docker)) { exit 1 }
    if (-Not (Test-DockerRunning)) { exit 1 }
    if (-Not (Test-WindowsContainerMode)) { exit 1 }
    Test-HyperV | Out-Null

    # Initialize environment
    Initialize-Environment

    # Confirm
    Write-Host ""
    Write-Info "Ready to start Windows containers"
    Write-Warning "This will download large Windows images (~2GB) on first run"
    $confirmation = Read-Host "Continue? (Y/N)"
    if ($confirmation -ne 'Y' -and $confirmation -ne 'y') {
        Write-Info "Cancelled by user"
        exit 0
    }

    # Start services
    if (-Not (Start-DockerCompose)) { exit 1 }

    Wait-ForServices
    Show-Status
    Show-SuccessMessage
}

# Run main function
Main
