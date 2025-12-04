#!/bin/bash
# Local Development Start Script
# Digital Student Registration System
#
# Quick start for localhost development
# No domain or SSL configuration required
#
# Usage:
#   ./scripts/start-local.sh

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'
BOLD='\033[1m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
ENV_FILE="${PROJECT_ROOT}/.env.local"
ENV_TEMPLATE="${PROJECT_ROOT}/.env.local.template"
COMPOSE_FILE="${PROJECT_ROOT}/docker-compose.local.yml"

# Header
echo ""
echo -e "${BLUE}${BOLD}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}${BOLD}║   Digital Student Registration - Local Development        ║${NC}"
echo -e "${BLUE}${BOLD}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check Docker
if ! docker info &> /dev/null; then
    echo -e "${YELLOW}[ERROR]${NC} Docker is not running"
    exit 1
fi
echo -e "${GREEN}✓${NC} Docker is running"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}[ERROR]${NC} docker-compose not found"
    exit 1
fi
echo -e "${GREEN}✓${NC} docker-compose is installed"

# Create .env.local if not exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${BLUE}[INFO]${NC} Creating .env.local from template..."
    cp "$ENV_TEMPLATE" "$ENV_FILE"
    echo -e "${GREEN}✓${NC} Created .env.local"
else
    echo -e "${GREEN}✓${NC} .env.local exists"
fi

# Start services
echo ""
echo -e "${BLUE}[INFO]${NC} Starting Docker services..."
cd "$PROJECT_ROOT"

docker-compose -f "$COMPOSE_FILE" up -d --build

# Wait for health checks
echo ""
echo -e "${BLUE}[INFO]${NC} Waiting for services to be ready..."
sleep 10

# Check status
echo ""
docker-compose -f "$COMPOSE_FILE" ps

# Success message
echo ""
echo -e "${GREEN}${BOLD}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}${BOLD}║   Local Development Environment Ready!                     ║${NC}"
echo -e "${GREEN}${BOLD}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BOLD}Application:${NC}     https://localhost"
echo -e "                       ${YELLOW}(Self-signed cert - accept browser warning)${NC}"
echo -e "  ${BOLD}Mongo Express:${NC}   http://localhost:8081"
echo -e "                       (user: admin, pass: admin123)"
echo ""
echo -e "${YELLOW}Useful Commands:${NC}"
echo -e "  ${BOLD}View logs:${NC}       docker-compose -f docker-compose.local.yml logs -f"
echo -e "  ${BOLD}Stop:${NC}            docker-compose -f docker-compose.local.yml down"
echo -e "  ${BOLD}Clean:${NC}           docker-compose -f docker-compose.local.yml down -v"
echo ""
echo -e "${GREEN}✓ Setup complete! Open https://localhost in your browser${NC}"
echo -e "${YELLOW}  Note: Browser will show security warning - click 'Advanced' → 'Proceed'${NC}"
echo ""
