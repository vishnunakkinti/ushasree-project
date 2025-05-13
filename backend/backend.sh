
#!/bin/bash
# Run this on your BACKEND EC2 (Private)

# Install Node.js and npm
sudo apt update -y
sudo apt install nodejs npm -y
npm install express express-session mysql2 


# Clone or upload backend code
# Assuming you upload to /home/ubuntu/backend
#cd /home/ubuntu/backend

# Install dependencies
npm install

# (Optional) Load environment variables from .env
# Make sure your .env file includes correct RDS credentials

# Example .env (store this securely, do not commit)
# DB_HOST=<your RDS endpoint>
# DB_USER=admin
# DB_PASSWORD=your_password
# DB_NAME=ushasree

# Run the backend
# node server.js

# Install pm2 to keep it running
sudo npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save

echo "Backend is now running on port 3000"
