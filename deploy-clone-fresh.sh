#!/bin/bash
set -e

# City-Ton VPS Fresh Clone Deployment Script
# This script clones the repository fresh and preserves necessary data

echo "🚀 Starting fresh clone deployment to VPS..."

# SSH credentials
SSH_HOST="82.165.243.89"
SSH_USER="root"
SSH_PASS="6gGAVENwsXiFlyp3"
OLD_DIR="/opt/cityton"
NEW_DIR="/opt/cityton-new"

# Function to run remote commands
run_remote() {
    sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no "$SSH_USER@$SSH_HOST" "$1"
}

echo "📦 Creating backup of current installation..."
run_remote "cd /opt && tar -czf cityton-backup-full-\$(date +%Y%m%d-%H%M%S).tar.gz cityton/"

echo ""
echo "💾 Preserving important data (.env, uploads, database volume)..."
run_remote "cp $OLD_DIR/.env /tmp/cityton.env.backup || echo 'No .env file found'"

echo ""
echo "🗑️  Stopping containers..."
run_remote "cd $OLD_DIR && docker compose down || true"

echo ""
echo "🔄 Cloning fresh repository..."
run_remote "cd /opt && git clone --branch feature/chat-knowledge-base https://github.com/waffiman/cityton.git cityton-new"

echo ""
echo "📋 Restoring .env file..."
run_remote "cp /tmp/cityton.env.backup $NEW_DIR/.env || echo 'No backup .env to restore'"

echo ""
echo "🔄 Swapping directories..."
run_remote "cd /opt && mv cityton cityton-old && mv cityton-new cityton"

echo ""
echo "🔨 Building Docker containers..."
run_remote "cd $OLD_DIR && docker compose build"

echo ""
echo "🚀 Starting containers..."
run_remote "cd $OLD_DIR && docker compose up -d"

echo ""
echo "⏳ Waiting for containers to start..."
sleep 20

echo ""
echo "📊 Container status:"
run_remote "docker ps | grep cityton"

echo ""
echo "📝 Checking logs..."
run_remote "cd $OLD_DIR && docker compose logs --tail=30 web"

echo ""
echo "✅ Deployment complete!"
echo "🌐 Website is now running feature/chat-knowledge-base"
echo ""
echo "Old directory saved as: /opt/cityton-old"
echo "To remove it after verifying deployment: ssh root@$SSH_HOST 'rm -rf /opt/cityton-old'"
echo ""
echo "To monitor logs:"
echo "sshpass -p '$SSH_PASS' ssh root@$SSH_HOST 'cd $OLD_DIR && docker compose logs -f web'"
