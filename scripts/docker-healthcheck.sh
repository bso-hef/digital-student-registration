#!/bin/sh
# Docker Health Check Script for Digital Student Registration
# This script checks if the application is healthy and ready to serve requests

set -e

# Configuration
HOST="${HOSTNAME:-localhost}"
PORT="${PORT:-3000}"
HEALTH_ENDPOINT="http://${HOST}:${PORT}/api/health/live"
TIMEOUT=5

# Color codes for output (if terminal supports it)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to log messages
log_info() {
    echo "[INFO] $1"
}

log_error() {
    echo "${RED}[ERROR] $1${NC}" >&2
}

log_success() {
    echo "${GREEN}[SUCCESS] $1${NC}"
}

log_warning() {
    echo "${YELLOW}[WARNING] $1${NC}"
}

# Function to check if Node.js is running
check_node_process() {
    if ! pgrep -x node > /dev/null; then
        log_error "Node.js process is not running"
        return 1
    fi
    log_info "Node.js process is running"
    return 0
}

# Function to check if the port is listening
check_port_listening() {
    if ! nc -z ${HOST} ${PORT} 2>/dev/null; then
        # Fallback: try using /proc/net/tcp if nc is not available
        if [ -f /proc/net/tcp ]; then
            # Convert port to hex (3000 = 0BB8)
            PORT_HEX=$(printf "%04X" ${PORT})
            if ! grep -q ":${PORT_HEX}" /proc/net/tcp; then
                log_error "Port ${PORT} is not listening"
                return 1
            fi
        else
            log_warning "Cannot verify port status (nc not available)"
        fi
    fi
    log_info "Port ${PORT} is listening"
    return 0
}

# Function to check the health endpoint
check_health_endpoint() {
    log_info "Checking health endpoint: ${HEALTH_ENDPOINT}"

    # Use wget if available (Alpine Linux default)
    if command -v wget > /dev/null 2>&1; then
        RESPONSE=$(wget --spider --timeout=${TIMEOUT} --tries=1 "${HEALTH_ENDPOINT}" 2>&1)
        if [ $? -eq 0 ]; then
            log_success "Health endpoint returned success"
            return 0
        else
            log_error "Health endpoint check failed: ${RESPONSE}"
            return 1
        fi

    # Fallback to curl
    elif command -v curl > /dev/null 2>&1; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time ${TIMEOUT} "${HEALTH_ENDPOINT}")
        if [ "${HTTP_CODE}" = "200" ]; then
            log_success "Health endpoint returned HTTP ${HTTP_CODE}"
            return 0
        else
            log_error "Health endpoint returned HTTP ${HTTP_CODE}"
            return 1
        fi

    # Fallback to basic node.js check (create a simple HTTP request)
    elif command -v node > /dev/null 2>&1; then
        RESPONSE=$(node -e "
            const http = require('http');
            http.get('${HEALTH_ENDPOINT}', (res) => {
                process.exit(res.statusCode === 200 ? 0 : 1);
            }).on('error', () => {
                process.exit(1);
            });
            setTimeout(() => process.exit(1), ${TIMEOUT}000);
        " 2>&1)

        if [ $? -eq 0 ]; then
            log_success "Health endpoint returned success"
            return 0
        else
            log_error "Health endpoint check failed"
            return 1
        fi

    else
        log_error "No HTTP client available (wget, curl, or node)"
        return 1
    fi
}

# Main health check execution
main() {
    log_info "==================== Health Check Started ===================="
    log_info "Host: ${HOST}"
    log_info "Port: ${PORT}"
    log_info "Endpoint: ${HEALTH_ENDPOINT}"
    log_info "Timeout: ${TIMEOUT}s"
    log_info "=============================================================="

    # Step 1: Check if Node.js process is running
    if ! check_node_process; then
        log_error "Health check failed: Node.js process not running"
        exit 1
    fi

    # Step 2: Check if port is listening
    if ! check_port_listening; then
        log_error "Health check failed: Port not listening"
        exit 1
    fi

    # Step 3: Check health endpoint
    if ! check_health_endpoint; then
        log_error "Health check failed: Health endpoint not responding"
        exit 1
    fi

    log_success "==================== Health Check Passed ===================="
    exit 0
}

# Run main function
main
