#!/bin/bash

echo "📦 Updating system and installing Nginx..."
sudo apt update -y
sudo apt install -y nginx

#echo "📁 Creating frontend directory if not exists..."
#mkdir -p /var/www/frontend

echo "📁 Copying website files to /var/www/frontend..."
sudo cp -r /home/ubuntu/ushasree-project/frontend/* /var/www/html/


echo "🛠️ Configuring Nginx for frontend..."

# Backup default config
sudo mv /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default.bak

# Create new Nginx config
sudo tee /etc/nginx/sites-available/frontend <<EOF
server {
    listen 80;
    server_name _;

    root /var/www/frontend;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOF

# Enable the new site
#sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/frontend

echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "✅ Frontend setup complete! Visit the public IP in your browser."


# Update API calls in JS files (e.g., fetch(...)) to point to the private IP or DNS name of your backend EC2, via the frontend.