# Use lightweight nginx base image
FROM nginx:alpine

# Remove default index page
RUN rm -rf /usr/share/nginx/html/*

# Copy your frontend files to nginx
COPY . /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# NGINX runs by default
