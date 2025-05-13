#!/bin/bash

echo "📦 Updating system and installing dependencies..."
sudo apt update -y
sudo apt install -y nodejs npm

echo "📁 Navigating to backend directory..."
cd /home/ubuntu/backend || { echo "❌ Directory not found!"; exit 1; }

echo "📦 Installing Node.js packages..."
npm install

echo "📦 Installing dotenv and PM2 globally..."
npm install dotenv
sudo npm install -g pm2

# Optional check for .env file
if [ ! -f .env ]; then
    echo "⚠️  .env file not found in backend directory. Please upload it!"
    exit 1
fi

# Check if dotenv variables are defined
MISSING_VARS=()
for var in DB_HOST DB_USER DB_PASSWORD DB_NAME; do
    if ! grep -q "^${var}=" .env; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo "❌ Missing the following environment variables in .env:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    exit 1
fi

echo "🚀 Starting backend with PM2..."
pm2 start server.js --name ushasree-backend

echo "💾 Saving PM2 startup state..."
pm2 save
pm2 startup | sudo tee /tmp/pm2_startup.sh > /dev/null
sudo bash /tmp/pm2_startup.sh

echo "✅ Backend setup complete and running in background."
