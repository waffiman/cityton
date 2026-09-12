#!/bin/bash
set -e

# City-Ton VPS Deployment Script
# This script pulls the latest changes and rebuilds the Docker containers

echo "🚀 Starting deployment to VPS..."

# SSH credentials
SSH_HOST="82.165.243.89"
SSH_USER="root"
SSH_PASS="6gGAVENwsXiFlyp3"
PROJECT_DIR="/opt/cityton"

# Function to run remote commands
run_remote() {
    sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no "$SSH_USER@$SSH_HOST" "$1"
}

echo "📍 Checking current state..."
run_remote "cd $PROJECT_DIR && echo 'Current branch:' && git branch && echo '' && echo 'Git status:' && git status"

echo ""
echo "📥 Fetching latest changes from GitHub..."
run_remote "cd $PROJECT_DIR && git fetch origin"

echo ""
echo "💾 Stashing any local changes..."
run_remote "cd $PROJECT_DIR && git add -A && git stash"

echo ""
echo "🔀 Switching to feature/chat-knowledge-base branch..."
run_remote "cd $PROJECT_DIR && git checkout -B feature/chat-knowledge-base origin/feature/chat-knowledge-base"

echo ""
echo "🔨 Rebuilding Docker containers..."
run_remote "cd $PROJECT_DIR && docker compose down && docker compose build --no-cache"

echo ""
echo "🚀 Starting containers..."
run_remote "cd $PROJECT_DIR && docker compose up -d"

echo ""
echo "⏳ Waiting for containers to be healthy..."
sleep 10

echo ""
echo "📊 Container status:"
run_remote "docker ps | grep cityton"

echo ""
echo "✅ Deployment complete!"
echo "🌐 Website should be live at your domain"
echo ""
echo "To check logs, run:"
echo "sshpass -p '$SSH_PASS' ssh root@$SSH_HOST 'cd $PROJECT_DIR && docker compose logs -f'"
