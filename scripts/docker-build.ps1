# Docker Build Script for Windows
# Builds the Digital Student Registration Docker image
#
# Usage:
#   .\scripts\docker-build.ps1 [-NoCache] [-LinuxImage]
#
# Parameters:
#   -NoCache     Build without using cache
#   -LinuxImage  Build Linux image instead of Windows (for WSL2/Docker Desktop)
#
# Environment variables (optional):
#   NEXT_PUBLIC_APP_URL - Application URL (default: http://localhost:3000)
#   NEXT_PUBLIC_API_URL - API URL (default: http://localhost:3000)
#   APP_PORT - Application port (default: 3000)

param(
    [switch]$NoCache,
    [switch]$LinuxImage
)

$ErrorActionPreference = "Stop"

# Change to project root directory
Push-Location (Split-Path -Parent $PSScriptRoot)

try {
    # Extract version from package.json
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    $VERSION = $packageJson.version

    # Image name
    $NAME = "dsr-app"

    # Validate extraction
    if ([string]::IsNullOrEmpty($VERSION)) {
        Write-Host "Error: Could not extract version from package.json" -ForegroundColor Red
        exit 1
    }

    # Build arguments
    $NEXT_PUBLIC_APP_URL = if ($env:NEXT_PUBLIC_APP_URL) { $env:NEXT_PUBLIC_APP_URL } else { "http://localhost:3000" }
    $NEXT_PUBLIC_API_URL = if ($env:NEXT_PUBLIC_API_URL) { $env:NEXT_PUBLIC_API_URL } else { "http://localhost:3000" }
    $NEXT_PUBLIC_NAME = if ($env:NEXT_PUBLIC_NAME) { $env:NEXT_PUBLIC_NAME } else { "Digital Student Registration" }
    $APP_PORT = if ($env:APP_PORT) { $env:APP_PORT } else { "3000" }

    # Determine Dockerfile and tags
    if ($LinuxImage) {
        $Dockerfile = "Dockerfile"
        $VersionTag = "${NAME}:${VERSION}"
        $LatestTag = "${NAME}:latest"
        $Platform = "Linux (Alpine)"
    } else {
        $Dockerfile = "Dockerfile.windows"
        $VersionTag = "${NAME}:${VERSION}-windows"
        $LatestTag = "${NAME}:latest-windows"
        $Platform = "Windows Server Core"
    }

    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Docker Build: $NAME" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Version:      $VERSION" -ForegroundColor Yellow
    Write-Host "App Name:     $NEXT_PUBLIC_NAME" -ForegroundColor White
    Write-Host "Platform:     $Platform" -ForegroundColor White
    Write-Host "App URL:      $NEXT_PUBLIC_APP_URL" -ForegroundColor White
    Write-Host "API URL:      $NEXT_PUBLIC_API_URL" -ForegroundColor White
    Write-Host "Port:         $APP_PORT" -ForegroundColor White
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""

    # Build the Docker image
    Write-Host "Building Docker image..." -ForegroundColor Yellow

    $buildArgs = @(
        "build"
        "--build-arg", "APP_VERSION=$VERSION"
        "--build-arg", "APP_PORT=$APP_PORT"
        "--build-arg", "NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL"
        "--build-arg", "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"
        "--build-arg", "NEXT_PUBLIC_VERSION=$VERSION"
        "--build-arg", "NEXT_PUBLIC_NAME=$NEXT_PUBLIC_NAME"
        "-t", $VersionTag
        "-t", $LatestTag
        "-f", $Dockerfile
        "."
    )

    if ($NoCache) {
        $buildArgs = @("build", "--no-cache") + $buildArgs[1..($buildArgs.Length-1)]
    }

    & docker @buildArgs

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Docker build failed" -ForegroundColor Red
        exit 1
    }

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Build Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Images created:" -ForegroundColor White
    Write-Host "  - $VersionTag" -ForegroundColor White
    Write-Host "  - $LatestTag" -ForegroundColor White
    Write-Host ""
    Write-Host "To run the container:" -ForegroundColor White
    if ($LinuxImage) {
        Write-Host "  docker compose --profile linux up -d" -ForegroundColor Cyan
    } else {
        Write-Host "  docker compose --profile windows up -d" -ForegroundColor Cyan
    }
    Write-Host "========================================" -ForegroundColor Green

} finally {
    Pop-Location
}
