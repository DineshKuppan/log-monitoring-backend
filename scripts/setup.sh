#!/bin/bash

echo "🚀 Setting up Log Monitoring Backend..."

# Create necessary directories
mkdir -p logs
mkdir -p uploads
mkdir -p monitoring

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "Please update .env with your configuration values"
fi

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your configuration"
echo "2. Start MongoDB: docker run -d -p 27017:27017 mongo:6"
echo "3. Start the application: npm run start:dev"
echo "4. Access the API: http://localhost:3000"
echo "5. View documentation: http://localhost:3000/api/docs"