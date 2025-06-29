import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  name: process.env.APP_NAME || 'Log Monitoring Backend',
  version: process.env.APP_VERSION || '1.0.0',
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // CORS settings
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  corsCredentials: process.env.CORS_CREDENTIALS === 'true',
  
  // API settings
  globalPrefix: process.env.API_PREFIX || 'api/v1',
  rateLimitTtl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
  rateLimitLimit: parseInt(process.env.RATE_LIMIT_LIMIT, 10) || 10,
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  logFormat: process.env.LOG_FORMAT || 'combined',
  
  // Security
  enableHelmet: process.env.ENABLE_HELMET !== 'false',
  enableCors: process.env.ENABLE_CORS !== 'false',
  
  // Documentation
  swaggerEnabled: process.env.SWAGGER_ENABLED !== 'false',
  swaggerPath: process.env.SWAGGER_PATH || 'api/docs',
  
  // Health checks
  healthCheckEnabled: process.env.HEALTH_CHECK_ENABLED !== 'false',
  healthCheckPath: process.env.HEALTH_CHECK_PATH || 'health',
  
  // File upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760, // 10MB
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  
  // Cache
  cacheEnabled: process.env.CACHE_ENABLED === 'true',
  cacheTtl: parseInt(process.env.CACHE_TTL, 10) || 3600,
  
  // Pagination defaults
  defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE, 10) || 10,
  maxPageSize: parseInt(process.env.MAX_PAGE_SIZE, 10) || 100,
}));

export type AppConfig = ReturnType<typeof appConfig>;