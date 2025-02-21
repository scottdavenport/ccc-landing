#!/bin/bash

# Function to check if a port is in use
check_port() {
    lsof -i :$1 >/dev/null 2>&1
    return $?
}

# Function to kill process on a port
kill_port() {
    echo "Killing process on port $1..."
    lsof -ti :$1 | xargs kill -9
}

# Check and kill processes on ports 3000-3002
for port in {3000..3002}
do
    if check_port $port; then
        echo "Found process running on port $port"
        kill_port $port
    fi
done

# Ensure NODE_ENV is set to development
export NODE_ENV=development

# Run build and dev server
echo "Building application..."
if npm run build; then
    echo "Build successful! Starting dev server..."
    npm run dev
else
    echo "Build failed. Please fix errors before starting dev server."
    exit 1
fi