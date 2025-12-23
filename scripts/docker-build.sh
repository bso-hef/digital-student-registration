#!/bin/bash
# Docker Build Script for Linux
# Builds the Digital Student Registration Docker image
#
# Usage:
#   ./scripts/docker-build.sh [--no-cache]
#
# Environment variables (optional):
#   NEXT_PUBLIC_APP_URL - Application URL (default: http://localhost:3000)
#   NEXT_PUBLIC_API_URL - API URL (default: http://localhost:3000)
#   APP_PORT - Application port (default: 3000)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to project root directory
cd "$(dirname "$0")/.."

# Extract version from package.json
if ! command -v jq &> /dev/null; then
    # Fallback if jq is not installed
    VERSION=$(grep '"version"' package.json | head -1 | sed 's/.*": "\(.*\)".*/\1/')
else
    VERSION=$(jq -r '.version' package.json)
fi

# Image name
NAME="dsr-app"

# Validate extraction
if [ -z "$VERSION" ]; then
    echo -e "${RED}Error: Could not extract version from package.json${NC}"
    exit 1
fi

# Build arguments
NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"
NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:3000}"
NEXT_PUBLIC_NAME="${NEXT_PUBLIC_NAME:-Digital Student Registration}"
APP_PORT="${APP_PORT:-3000}"

# Check for --no-cache flag
NO_CACHE=""
if [ "$1" = "--no-cache" ]; then
    NO_CACHE="--no-cache"
fi

echo -e "${GREEN}========================================"
echo "Docker Build: ${NAME}"
echo "========================================"
echo -e "Version:      ${YELLOW}${VERSION}${GREEN}"
echo "App Name:     ${NEXT_PUBLIC_NAME}"
echo "Platform:     Linux (Alpine)"
echo "App URL:      ${NEXT_PUBLIC_APP_URL}"
echo "API URL:      ${NEXT_PUBLIC_API_URL}"
echo "Port:         ${APP_PORT}"
echo -e "========================================${NC}"
echo ""

# Build the Docker image
echo -e "${YELLOW}Building Docker image...${NC}"

docker build \
    ${NO_CACHE} \
    --build-arg APP_VERSION="${VERSION}" \
    --build-arg APP_PORT="${APP_PORT}" \
    --build-arg NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL}" \
    --build-arg NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL}" \
    --build-arg NEXT_PUBLIC_VERSION="${VERSION}" \
    --build-arg NEXT_PUBLIC_NAME="${NEXT_PUBLIC_NAME}" \
    -t "${NAME}:${VERSION}" \
    -t "${NAME}:latest" \
    -f Dockerfile .

echo ""
echo -e "${GREEN}========================================"
echo "Build Complete!"
echo "========================================"
echo "Images created:"
echo "  - ${NAME}:${VERSION}"
echo "  - ${NAME}:latest"
echo ""
echo "To run the container:"
echo "  docker compose --profile linux up -d"
echo -e "========================================${NC}"
