#!/bin/bash
# Production Deployment Start Script
# Digital Student Registration System
#
# This script automates the production deployment process:
# 1. Validates environment configuration
# 2. Generates secrets if missing
# 3. Checks DNS configuration
# 4. Starts Docker Compose services
# 5. Waits for health checks
# 6. Displays status and access information
#
# Usage:
#   ./scripts/start.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
ENV_FILE="${PROJECT_ROOT}/.env.production"
ENV_TEMPLATE="${PROJECT_ROOT}/.env.production.template"
COMPOSE_FILE="${PROJECT_ROOT}/docker-compose.production.yml"

# ============================================
# Helper Functions
# ============================================

print_header() {
    echo ""
    echo -e "${CYAN}${BOLD}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}${BOLD}║                                                            ║${NC}"
    echo -e "${CYAN}${BOLD}║        Digital Student Registration System                ║${NC}"
    echo -e "${CYAN}${BOLD}║        Production Deployment Script                       ║${NC}"
    echo -e "${CYAN}${BOLD}║                                                            ║${NC}"
    echo -e "${CYAN}${BOLD}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

log_step() {
    echo ""
    echo -e "${MAGENTA}${BOLD}▶ $1${NC}"
}

generate_secret() {
    local length=${1:-64}
    openssl rand -base64 $length | tr -d "=+/" | cut -c1-$length
}

check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "Required command '$1' not found. Please install it first."
        exit 1
    fi
}

# ============================================
# Validation Functions
# ============================================

check_prerequisites() {
    log_step "Checking prerequisites..."

    # Check required commands
    local required_commands=("docker" "docker-compose" "openssl")
    for cmd in "${required_commands[@]}"; do
        if command -v $cmd &> /dev/null; then
            log_success "$cmd is installed"
        else
            log_error "$cmd is not installed"
            exit 1
        fi
    done

    # Check Docker daemon
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running"
        exit 1
    fi
    log_success "Docker daemon is running"

    # Check if running as root (not recommended)
    if [ "$EUID" -eq 0 ]; then
        log_warning "Running as root is not recommended"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

check_environment_file() {
    log_step "Checking environment configuration..."

    if [ ! -f "$ENV_FILE" ]; then
        log_warning ".env.production file not found"

        if [ -f "$ENV_TEMPLATE" ]; then
            log_info "Copying template to .env.production"
            cp "$ENV_TEMPLATE" "$ENV_FILE"
            log_success "Created .env.production from template"
        else
            log_error "Template file not found: $ENV_TEMPLATE"
            exit 1
        fi
    else
        log_success ".env.production file exists"
    fi
}

generate_missing_secrets() {
    log_step "Checking secrets..."

    # Load environment file
    source "$ENV_FILE"

    local secrets_generated=false

    # Check NEXTAUTH_SECRET
    if [ -z "$NEXTAUTH_SECRET" ] || [ "$NEXTAUTH_SECRET" = "CHANGE_ME_TO_RANDOM_64_CHAR_STRING" ]; then
        log_warning "NEXTAUTH_SECRET not set, generating..."
        local new_secret=$(generate_secret 64)
        sed -i.bak "s/^NEXTAUTH_SECRET=.*/NEXTAUTH_SECRET=${new_secret}/" "$ENV_FILE"
        log_success "Generated NEXTAUTH_SECRET"
        secrets_generated=true
    fi

    # Check MONGO_PASSWORD
    if [ -z "$MONGO_PASSWORD" ] || [ "$MONGO_PASSWORD" = "CHANGE_ME" ]; then
        log_warning "MONGO_PASSWORD not set, generating..."
        local new_password=$(generate_secret 32)
        sed -i.bak "s/^MONGO_PASSWORD=.*/MONGO_PASSWORD=${new_password}/" "$ENV_FILE"
        log_success "Generated MONGO_PASSWORD"
        secrets_generated=true
    fi

    # Check REDIS_PASSWORD
    if [ -z "$REDIS_PASSWORD" ] || [ "$REDIS_PASSWORD" = "CHANGE_ME" ]; then
        log_warning "REDIS_PASSWORD not set, generating..."
        local new_password=$(generate_secret 32)
        sed -i.bak "s/^REDIS_PASSWORD=.*/REDIS_PASSWORD=${new_password}/" "$ENV_FILE"
        log_success "Generated REDIS_PASSWORD"
        secrets_generated=true
    fi

    if [ "$secrets_generated" = true ]; then
        log_success "Secrets generated successfully"
        # Reload environment
        source "$ENV_FILE"
    else
        log_success "All secrets are configured"
    fi

    # Clean up backup files
    rm -f "${ENV_FILE}.bak"
}

validate_configuration() {
    log_step "Validating configuration..."

    # Load environment file
    source "$ENV_FILE"

    local errors=0

    # Check required variables
    if [ -z "$DOMAIN" ] || [ "$DOMAIN" = "your-domain.com" ]; then
        log_error "DOMAIN is not set in .env.production"
        errors=$((errors + 1))
    else
        log_success "Domain: $DOMAIN"
    fi

    if [ -z "$ACME_EMAIL" ] || [ "$ACME_EMAIL" = "admin@your-domain.com" ]; then
        log_error "ACME_EMAIL is not set in .env.production"
        errors=$((errors + 1))
    else
        log_success "ACME Email: $ACME_EMAIL"
    fi

    if [ -z "$MONGO_USER" ]; then
        log_error "MONGO_USER is not set"
        errors=$((errors + 1))
    fi

    if [ -z "$MONGO_DB" ]; then
        log_error "MONGO_DB is not set"
        errors=$((errors + 1))
    fi

    if [ $errors -gt 0 ]; then
        log_error "Configuration validation failed with $errors error(s)"
        log_info "Please edit $ENV_FILE and set the required values"
        exit 1
    fi

    log_success "Configuration is valid"
}

check_dns() {
    log_step "Checking DNS configuration..."

    source "$ENV_FILE"

    if [ -z "$DOMAIN" ] || [ "$DOMAIN" = "your-domain.com" ]; then
        log_warning "Domain not configured, skipping DNS check"
        return
    fi

    # Try to resolve domain
    if command -v dig &> /dev/null; then
        local dns_ip=$(dig +short "$DOMAIN" | tail -n1)
        if [ -z "$dns_ip" ]; then
            log_warning "DNS resolution failed for $DOMAIN"
            log_info "Make sure your domain DNS is configured to point to this server"
        else
            log_success "DNS resolved: $DOMAIN -> $dns_ip"

            # Get server's public IP (best effort)
            if command -v curl &> /dev/null; then
                local server_ip=$(curl -s ifconfig.me || echo "unknown")
                if [ "$dns_ip" = "$server_ip" ]; then
                    log_success "DNS points to this server"
                else
                    log_warning "DNS IP ($dns_ip) differs from server IP ($server_ip)"
                    log_info "This is okay if you're behind a proxy or load balancer"
                fi
            fi
        fi
    else
        log_warning "dig command not found, skipping DNS check"
    fi
}

check_ports() {
    log_step "Checking port availability..."

    local ports=(80 443)
    local port_issues=false

    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            log_warning "Port $port is already in use"
            port_issues=true
        else
            log_success "Port $port is available"
        fi
    done

    if [ "$port_issues" = true ]; then
        log_warning "Some ports are in use. Make sure no other web server is running."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# ============================================
# Deployment Functions
# ============================================

build_images() {
    log_step "Building Docker images..."

    cd "$PROJECT_ROOT"

    if docker-compose -f "$COMPOSE_FILE" build --no-cache; then
        log_success "Docker images built successfully"
    else
        log_error "Failed to build Docker images"
        exit 1
    fi
}

start_services() {
    log_step "Starting services..."

    cd "$PROJECT_ROOT"

    if docker-compose -f "$COMPOSE_FILE" up -d; then
        log_success "Services started successfully"
    else
        log_error "Failed to start services"
        exit 1
    fi
}

wait_for_health() {
    log_step "Waiting for services to be healthy..."

    local max_wait=180
    local elapsed=0
    local interval=5

    cd "$PROJECT_ROOT"

    while [ $elapsed -lt $max_wait ]; do
        local unhealthy=$(docker-compose -f "$COMPOSE_FILE" ps | grep -E "unhealthy|starting" | wc -l)

        if [ $unhealthy -eq 0 ]; then
            log_success "All services are healthy"
            return 0
        fi

        echo -ne "${BLUE}[INFO]${NC} Waiting for services... ${elapsed}s / ${max_wait}s\r"
        sleep $interval
        elapsed=$((elapsed + interval))
    done

    echo ""
    log_error "Timeout waiting for services to be healthy"
    log_info "Check logs with: docker-compose -f $COMPOSE_FILE logs"
    return 1
}

display_status() {
    log_step "Deployment Status"

    cd "$PROJECT_ROOT"

    echo ""
    docker-compose -f "$COMPOSE_FILE" ps
    echo ""

    source "$ENV_FILE"

    echo -e "${GREEN}${BOLD}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}${BOLD}║                                                            ║${NC}"
    echo -e "${GREEN}${BOLD}║  Deployment Successful!                                    ║${NC}"
    echo -e "${GREEN}${BOLD}║                                                            ║${NC}"
    echo -e "${GREEN}${BOLD}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "  ${BOLD}Application URL:${NC}  https://${DOMAIN}"
    echo -e "  ${BOLD}Admin Login:${NC}      https://${DOMAIN}/login"
    echo -e "  ${BOLD}Health Check:${NC}     https://${DOMAIN}/api/health/live"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo -e "  1. Visit https://${DOMAIN} in your browser"
    echo -e "  2. Complete the initial setup wizard at /setup"
    echo -e "  3. Save your recovery code securely"
    echo ""
    echo -e "${CYAN}Useful Commands:${NC}"
    echo -e "  ${BOLD}View logs:${NC}        docker-compose -f $COMPOSE_FILE logs -f"
    echo -e "  ${BOLD}Check status:${NC}     docker-compose -f $COMPOSE_FILE ps"
    echo -e "  ${BOLD}Stop services:${NC}    docker-compose -f $COMPOSE_FILE down"
    echo -e "  ${BOLD}Restart:${NC}          docker-compose -f $COMPOSE_FILE restart"
    echo ""
}

# ============================================
# Main Execution
# ============================================

main() {
    print_header

    # Run all checks
    check_prerequisites
    check_environment_file
    generate_missing_secrets
    validate_configuration
    check_dns
    check_ports

    # Ask for confirmation
    echo ""
    log_info "Ready to deploy. This will:"
    echo "  - Build Docker images"
    echo "  - Start all services (Caddy, App, MongoDB, Redis)"
    echo "  - Obtain SSL certificate from Let's Encrypt"
    echo ""
    read -p "Continue? (y/N): " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Deployment cancelled"
        exit 0
    fi

    # Deploy
    build_images
    start_services
    wait_for_health

    # Show results
    display_status

    log_success "Production deployment complete!"
}

# Run main function
main "$@"
