#!/bin/bash

echo "🐳 Building Docker containers..."

# Build the application image
docker build -t log-monitoring-backend:latest .

# Start the complete stack
docker-compose up -d

echo "✅ Docker containers started!"
echo ""
echo "Services available at:"
echo "- API: http://localhost:3000"
echo "- Prometheus: http://localhost:9090"
echo "- Grafana: http://localhost:3001"
echo "- MongoDB: localhost:27017"