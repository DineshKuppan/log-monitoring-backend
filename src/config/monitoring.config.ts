import { registerAs } from '@nestjs/config';

export const monitoringConfig = registerAs('monitoring', () => ({
  // Metrics settings
  metrics: {
    enabled: process.env.METRICS_ENABLED !== 'false',
    path: process.env.METRICS_PATH || 'metrics',
    collectDefaultMetrics: process.env.COLLECT_DEFAULT_METRICS !== 'false',
    defaultMetricsTimeout: parseInt(process.env.DEFAULT_METRICS_TIMEOUT, 10) || 10000,
    
    // Custom metrics
    httpRequestDuration: {
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
    },
    
    httpRequestTotal: {
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
    },
    
    logEntries: {
      name: 'log_entries_total',
      help: 'Total number of log entries',
    },
    
    activeConnections: {
      name: 'active_connections',
      help: 'Number of active connections',
    },
  },
  
  // Health check settings
  health: {
    enabled: process.env.HEALTH_CHECK_ENABLED !== 'false',
    path: process.env.HEALTH_CHECK_PATH || 'health',
    
    // Database health check
    database: {
      enabled: process.env.DB_HEALTH_CHECK_ENABLED !== 'false',
      timeout: parseInt(process.env.DB_HEALTH_CHECK_TIMEOUT, 10) || 5000,
    },
    
    // Memory health check
    memory: {
      enabled: process.env.MEMORY_HEALTH_CHECK_ENABLED !== 'false',
      thresholdHeap: parseInt(process.env.MEMORY_HEAP_THRESHOLD, 10) || 150 * 1024 * 1024, // 150MB
      thresholdRSS: parseInt(process.env.MEMORY_RSS_THRESHOLD, 10) || 150 * 1024 * 1024, // 150MB
    },
    
    // Disk health check
    disk: {
      enabled: process.env.DISK_HEALTH_CHECK_ENABLED !== 'false',
      path: process.env.DISK_HEALTH_CHECK_PATH || '/',
      thresholdPercent: parseFloat(process.env.DISK_THRESHOLD_PERCENT) || 0.9, // 90%
    },
  },
  
  // Logging settings
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
    
    // Console transport
    console: {
      enabled: process.env.LOG_CONSOLE_ENABLED !== 'false',
      colorize: process.env.LOG_CONSOLE_COLORIZE !== 'false',
      timestamp: process.env.LOG_CONSOLE_TIMESTAMP !== 'false',
    },
    
    // File transport
    file: {
      enabled: process.env.LOG_FILE_ENABLED === 'true',
      filename: process.env.LOG_FILE_NAME || 'logs/app.log',
      maxsize: parseInt(process.env.LOG_FILE_MAX_SIZE, 10) || 10485760, // 10MB
      maxFiles: parseInt(process.env.LOG_FILE_MAX_FILES, 10) || 5,
      rotationFormat: process.env.LOG_FILE_ROTATION_FORMAT || false,
    },
    
    // Error file transport
    errorFile: {
      enabled: process.env.LOG_ERROR_FILE_ENABLED === 'true',
      filename: process.env.LOG_ERROR_FILE_NAME || 'logs/error.log',
      level: 'error',
      maxsize: parseInt(process.env.LOG_ERROR_FILE_MAX_SIZE, 10) || 10485760, // 10MB
      maxFiles: parseInt(process.env.LOG_ERROR_FILE_MAX_FILES, 10) || 5,
    },
  },
  
  // Tracing settings
  tracing: {
    enabled: process.env.TRACING_ENABLED === 'true',
    serviceName: process.env.TRACING_SERVICE_NAME || 'log-monitoring-backend',
    endpoint: process.env.TRACING_ENDPOINT,
    sampleRate: parseFloat(process.env.TRACING_SAMPLE_RATE) || 0.1,
  },
  
  // Alerting settings
  alerting: {
    enabled: process.env.ALERTING_ENABLED === 'true',
    webhookUrl: process.env.ALERT_WEBHOOK_URL,
    
    // Error rate alerts
    errorRate: {
      enabled: process.env.ERROR_RATE_ALERT_ENABLED === 'true',
      threshold: parseFloat(process.env.ERROR_RATE_THRESHOLD) || 0.05, // 5%
      windowSize: parseInt(process.env.ERROR_RATE_WINDOW_SIZE, 10) || 300, // 5 minutes
    },
    
    // Response time alerts
    responseTime: {
      enabled: process.env.RESPONSE_TIME_ALERT_ENABLED === 'true',
      threshold: parseInt(process.env.RESPONSE_TIME_THRESHOLD, 10) || 5000, // 5 seconds
      percentile: parseFloat(process.env.RESPONSE_TIME_PERCENTILE) || 0.95, // 95th percentile
    },
  },
}));

export type MonitoringConfig = ReturnType<typeof monitoringConfig>;