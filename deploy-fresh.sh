#!/bin/bash
set -e

# City-Ton VPS Fresh Deployment Script
# This script backs up the current state and sets up a proper git repository

echo "🚀 Starting fresh deployment to VPS..."

# SSH credentials
SSH_HOST="82.165.243.89"
SSH_USER="root"
SSH_PASS="6gGAVENwsXiFlyp3"
PROJECT_DIR="/opt/cityton"

# Function to run remote commands
run_remote() {
    sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no "$SSH_USER@$SSH_HOST" "$1"
}

echo "📦 Creating backup of current installation..."
run_remote "cd /opt && tar -czf cityton-backup-\$(date +%Y%m%d-%H%M%S).tar.gz cityton/ && ls -lh cityton-backup-*.tar.gz | tail -1"

echo ""
echo "🗑️  Stopping and removing containers..."
run_remote "cd $PROJECT_DIR && docker compose down || true"

echo ""
echo "🧹 Removing old git directory..."
run_remote "cd $PROJECT_DIR && rm -rf .git"

echo ""
echo "📥 Setting up fresh git repository..."
run_remote "cd $PROJECT_DIR && git init && git remote add origin https://github.com/waffiman/cityton.git"

echo ""
echo "🔄 Fetching all branches from GitHub..."
run_remote "cd $PROJECT_DIR && git fetch origin"

echo ""
echo "🔀 Checking out feature/chat-knowledge-base branch..."
run_remote "cd $PROJECT_DIR && git checkout -B feature/chat-knowledge-base origin/feature/chat-knowledge-base"

echo ""
echo "🔨 Rebuilding Docker containers..."
run_remote "cd $PROJECT_DIR && docker compose build --no-cache"

echo ""
echo "🚀 Starting containers..."
run_remote "cd $PROJECT_DIR && docker compose up -d"

echo ""
echo "⏳ Waiting for containers to start..."
sleep 15

echo ""
echo "📊 Container status:"
run_remote "docker ps | grep cityton"

echo ""
echo "📝 Checking recent logs..."
run_remote "cd $PROJECT_DIR && docker compose logs --tail=20 web"

echo ""
echo "✅ Deployment complete!"
echo "🌐 Website should be live with the feature/chat-knowledge-base changes"
echo ""
echo "To check logs, run:"
echo "sshpass -p '$SSH_PASS' ssh root@$SSH_HOST 'cd $PROJECT_DIR && docker compose logs -f web'"
