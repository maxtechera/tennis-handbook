#!/bin/bash

# ConvertKit Integration Deployment Script
# This script handles the deployment of the tennis workout website with ConvertKit integration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Check if required environment variables are set
check_env_vars() {
    print_status "Checking environment variables..."
    
    local missing_vars=()
    
    # Check for ConvertKit variables
    if [ -z "${CONVERTKIT_API_KEY}" ]; then
        missing_vars+=("CONVERTKIT_API_KEY")
    fi
    
    if [ -z "${CONVERTKIT_FORM_ID}" ]; then
        missing_vars+=("CONVERTKIT_FORM_ID")
    fi
    
    # Check for deployment variables
    if [ -z "${VERCEL_TOKEN}" ]; then
        missing_vars+=("VERCEL_TOKEN")
    fi
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        echo ""
        echo "Please set these in your .env file or export them before running this script."
        exit 1
    fi
    
    print_status "All required environment variables are set"
}

# Build the project
build_project() {
    print_status "Building the project..."
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        pnpm install || npm install
    fi
    
    # Run build
    pnpm build || npm run build
    
    if [ $? -eq 0 ]; then
        print_status "Build completed successfully"
    else
        print_error "Build failed"
        exit 1
    fi
}

# Validate ConvertKit integration
validate_convertkit() {
    print_status "Validating ConvertKit integration..."
    
    # Test ConvertKit API connection
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "X-Api-Secret: ${CONVERTKIT_API_KEY}" \
        "https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}")
    
    if [ "$response" -eq 200 ]; then
        print_status "ConvertKit API connection successful"
    else
        print_error "ConvertKit API connection failed (HTTP $response)"
        print_error "Please check your CONVERTKIT_API_KEY and CONVERTKIT_FORM_ID"
        exit 1
    fi
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Set environment variables for Vercel
    export VERCEL_ORG_ID="${VERCEL_ORG_ID}"
    export VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID}"
    
    # Deploy with environment variables
    npx vercel --prod --token="${VERCEL_TOKEN}" \
        -e CONVERTKIT_API_KEY="${CONVERTKIT_API_KEY}" \
        -e CONVERTKIT_FORM_ID="${CONVERTKIT_FORM_ID}" \
        -e NEXT_PUBLIC_CONVERTKIT_FORM_ID="${CONVERTKIT_FORM_ID}"
    
    if [ $? -eq 0 ]; then
        print_status "Deployment completed successfully"
    else
        print_error "Deployment failed"
        exit 1
    fi
}

# Run post-deployment tests
post_deployment_tests() {
    print_status "Running post-deployment tests..."
    
    # Get the deployment URL
    DEPLOYMENT_URL=$(npx vercel ls --token="${VERCEL_TOKEN}" | grep "Production" | awk '{print $2}' | head -n 1)
    
    if [ -z "$DEPLOYMENT_URL" ]; then
        print_warning "Could not determine deployment URL for testing"
        return
    fi
    
    print_status "Testing deployment at: $DEPLOYMENT_URL"
    
    # Test if the site is accessible
    response=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL")
    
    if [ "$response" -eq 200 ]; then
        print_status "Site is accessible"
    else
        print_warning "Site returned HTTP $response"
    fi
    
    # Test if ConvertKit form is present
    if curl -s "$DEPLOYMENT_URL" | grep -q "convertkit"; then
        print_status "ConvertKit form detected on the page"
    else
        print_warning "ConvertKit form not detected on the page"
    fi
}

# Main deployment flow
main() {
    echo "======================================"
    echo "ConvertKit Integration Deployment"
    echo "======================================"
    echo ""
    
    # Load environment variables from .env file if it exists
    if [ -f ".env" ]; then
        print_status "Loading environment variables from .env file..."
        export $(cat .env | grep -v '^#' | xargs)
    fi
    
    # Check environment variables
    check_env_vars
    
    # Validate ConvertKit integration
    validate_convertkit
    
    # Build the project
    build_project
    
    # Deploy to Vercel
    deploy_to_vercel
    
    # Run post-deployment tests
    post_deployment_tests
    
    echo ""
    echo "======================================"
    print_status "Deployment completed successfully!"
    echo "======================================"
}

# Run the main function
main "$@"