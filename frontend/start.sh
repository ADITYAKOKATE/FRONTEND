#!/bin/bash

# NASA BioExplorer Startup Script
# This script sets up and starts the NASA BioExplorer application

echo "🚀 NASA BioExplorer - Starting Application Setup"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16+ and try again."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if MongoDB is running
check_mongodb() {
    if ! command -v mongod &> /dev/null; then
        print_warning "MongoDB is not installed. Please install MongoDB and start the service."
        print_warning "You can install MongoDB from: https://docs.mongodb.com/manual/installation/"
        return 1
    fi
    
    # Try to connect to MongoDB
    if mongosh --eval "db.runCommand('ping')" --quiet &> /dev/null; then
        print_success "MongoDB is running"
        return 0
    else
        print_warning "MongoDB is not running. Please start MongoDB service."
        print_warning "On macOS: brew services start mongodb-community"
        print_warning "On Ubuntu: sudo systemctl start mongod"
        return 1
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    if [ -f "package.json" ]; then
        npm install
        print_success "Root dependencies installed"
    fi
    
    # Install server dependencies
    if [ -d "server" ]; then
        cd server
        npm install
        print_success "Server dependencies installed"
        cd ..
    fi
    
    # Install client dependencies
    if [ -d "client" ]; then
        cd client
        npm install
        print_success "Client dependencies installed"
        cd ..
    fi
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Server environment
    if [ ! -f "server/.env" ]; then
        if [ -f "server/env.example" ]; then
            cp server/env.example server/.env
            print_success "Created server/.env from template"
        else
            print_warning "No server/.env file found. You may need to create one manually."
        fi
    else
        print_success "Server .env file already exists"
    fi
    
    # Client environment
    if [ ! -f "client/.env" ]; then
        cat > client/.env << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_VERSION=1.0.0
EOF
        print_success "Created client/.env file"
    else
        print_success "Client .env file already exists"
    fi
}

# Seed database
seed_database() {
    print_status "Seeding database with sample data..."
    
    if [ -d "server" ]; then
        cd server
        npm run seed
        if [ $? -eq 0 ]; then
            print_success "Database seeded successfully"
        else
            print_warning "Database seeding failed. You may need to seed manually."
        fi
        cd ..
    fi
}

# Start the application
start_application() {
    print_status "Starting NASA BioExplorer application..."
    
    # Check if we should run in development mode
    if [ "$1" = "dev" ]; then
        print_status "Starting in development mode..."
        npm run dev
    else
        print_status "Starting in production mode..."
        
        # Build client
        if [ -d "client" ]; then
            cd client
            npm run build
            print_success "Client built successfully"
            cd ..
        fi
        
        # Start server
        if [ -d "server" ]; then
            cd server
            npm start
        fi
    fi
}

# Main execution
main() {
    echo ""
    print_status "Checking system requirements..."
    
    # Check Node.js
    check_node
    
    # Check MongoDB (optional)
    check_mongodb
    MONGODB_OK=$?
    
    echo ""
    print_status "Installing dependencies..."
    install_dependencies
    
    echo ""
    print_status "Setting up environment..."
    setup_environment
    
    # Only seed if MongoDB is available
    if [ $MONGODB_OK -eq 0 ]; then
        echo ""
        print_status "Seeding database..."
        seed_database
    else
        print_warning "Skipping database seeding due to MongoDB not being available"
    fi
    
    echo ""
    print_success "Setup completed successfully!"
    echo ""
    print_status "🚀 NASA BioExplorer is ready to launch!"
    echo ""
    print_status "To start the application:"
    print_status "  Development: ./start.sh dev"
    print_status "  Production:  ./start.sh"
    echo ""
    print_status "The application will be available at:"
    print_status "  Frontend: http://localhost:3000"
    print_status "  Backend:  http://localhost:5000"
    echo ""
}

# Run main function with all arguments
main "$@"
