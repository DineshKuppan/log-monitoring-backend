## Setup Instructions

1. **Clone and setup:**
   ```bash
   mkdir log-monitoring-backend
   cd log-monitoring-backend
   npm init -y
   npm install [dependencies from package.json]
   ```

2. **Create the directory structure and files as shown above**

3. **Build and run with Docker:**
   ```bash
   docker-compose up --build
   ```

4. **Access the services:**
   - API: http://localhost:3000
   - Swagger UI: http://localhost:3000/api
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3001 (admin/admin)

5. **Test the API:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/logs \
     -H "Content-Type: application/json" \
     -d '{
       "message": "Test log message",
       "level": "info",
       "service": "test-service",
       "environment": "development"
     }'
   ```


🏗️ Architecture Overview
Core Features:

NestJS with TypeScript for robust backend architecture
MongoDB with Mongoose for flexible log storage
Prometheus metrics collection with custom counters and histograms
Grafana ready configuration for dashboards
Docker containerization with multi-service setup
Swagger API documentation

🚀 Key Capabilities
Log Management:

Store logs with multiple levels (error, warn, info, debug)
Advanced filtering and pagination
Real-time log statistics and aggregations
Request tracking with correlation IDs

Observability:

Prometheus metrics for HTTP requests, log counts, and performance
Health checks with Terminus
Request/response logging middleware
Custom metrics decorators

Production Ready:

Docker Compose with MongoDB, Prometheus, and Grafana
Environment-based configuration
Proper error handling and validation
Scalable database indexing

🛠️ Quick Start

Setup the project:
bashmkdir log-monitoring-backend && cd log-monitoring-backend
# Copy all files from the artifact
npm install

Run with Docker:
bashdocker-compose up --build

Access services:

API: http://localhost:3000
API Docs: http://localhost:3000/api
Prometheus: http://localhost:9090
Grafana: http://localhost:3001 (admin/admin)



📊 API Endpoints

POST /api/v1/logs - Create log entries
GET /api/v1/logs - Query logs with filters
GET /api/v1/logs/stats - Get log statistics
GET /api/v1/metrics - Prometheus metrics
GET /api/v1/health - Health checks


## ✅ **Complete Features:**

1. **Common Utilities:**
   - Metrics decorator for method tracking
   - Comprehensive logging interceptor with request/response tracking
   - Pagination DTOs with sorting support

2. **Configuration:**
   - App configuration with comprehensive settings
   - Database configuration with connection pooling
   - Monitoring configuration for metrics, health checks, and alerting

3. **Health Monitoring:**
   - Complete health checks for database, memory, and disk
   - Liveness and readiness probes
   - Application information endpoints

4. **Module Organization:**
   - Proper module imports and exports
   - Forward references to avoid circular dependencies
   - Global metrics module for cross-module usage

5. **Application Core:**
   - Main app controller with version and status endpoints
   - App service with system information and formatted output

6. **Development Tools:**
   - Comprehensive ESLint configuration
   - TypeScript configuration with path mapping
   - Prettier configuration for code formatting
   - Setup and build scripts