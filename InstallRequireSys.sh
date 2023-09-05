#!/bin/bash
# Check and install curl if not present
command -v curl > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Installing curl..."
    sudo apt-get update
    sudo apt-get install -y curl
    echo "Curl installed"
else
    echo "Curl is already installed"
fi
# Checking nodejs
command -v node > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "You already have Node.js..."
else
    echo "Node.js installing"
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "Node.js installed"
fi

# Check nginx
command -v nginx > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "You already have nginx"
else
    echo "Nginx installing"
    sudo apt-get update
    sudo apt-get install -y nginx
    echo "Nginx installed"
fi

if [ -f /etc/nginx/sites-available/default ]; then
    sudo rm /etc/nginx/sites-available/default
fi

echo "server {
    listen 80;
    location / {
        root /var/www/html/monitoring;
        try_files \$uri \$uri/ /index.html;
    }
}" | sudo tee /etc/nginx/sites-available/default

if [ -f /etc/systemd/system/backendMonitoring.service ]; then
    sudo rm /etc/systemd/system/backendMonitoring.service
fi

echo "[Unit]
Description=Node.js backend monitoring Service
After=network.target

[Service]
User=godliony
WorkingDirectory=/home/godliony/backend
ExecStart=/usr/bin/node index.js
Restart=always

[Install]
WantedBy=multi-user.target" | sudo tee /etc/systemd/system/backendMonitoring.service

sudo systemctl enable backendMonitoring.service
sudo systemctl start backendMonitoring.service

if [ ! -d /var/www/html/monitoring ]; then
    mkdir /var/www/html/monitoring
    if ! getent group installgroup >/dev/null; then
        sudo groupadd installgroup
    fi
    sudo chown godliony:installgroup /var/www/html/monitoring
fi
sudo chmod 666 /dev/ttyUSB*
sudo service nginx restart
