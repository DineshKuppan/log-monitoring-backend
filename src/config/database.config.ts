import { registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const databaseConfig = registerAs('database', () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/log-monitoring',
  
  // Connection options
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
    // Connection pool settings
    maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE, 10) || 10,
    minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE, 10) || 1,
    
    // Timeout settings
    serverSelectionTimeoutMS: parseInt(process.env.DB_SERVER_SELECTION_TIMEOUT, 10) || 5000,
    socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT, 10) || 45000,
    connectTimeoutMS: parseInt(process.env.DB_CONNECT_TIMEOUT, 10) || 10000,
    
    // Retry settings
    retryWrites: process.env.DB_RETRY_WRITES !== 'false',
    retryReads: process.env.DB_RETRY_READS !== 'false',
    
    // Compression
    compressors: process.env.DB_COMPRESSORS?.split(',') || ['zlib'],
    
    // Read preference
    readPreference: process.env.DB_READ_PREFERENCE || 'primary',
    
    // Write concern
    w: process.env.DB_WRITE_CONCERN || 'majority',
    wtimeout: parseInt(process.env.DB_WRITE_TIMEOUT, 10) || 10000,
    
    // SSL/TLS
    ssl: process.env.DB_SSL === 'true',
    sslValidate: process.env.DB_SSL_VALIDATE !== 'false',
    
    // Auth
    authSource: process.env.DB_AUTH_SOURCE || 'admin',
    
    // Application name
    appName: process.env.APP_NAME || 'log-monitoring-backend',
  } as MongooseModuleOptions,
  
  // Migration settings
  migrations: {
    enabled: process.env.DB_MIGRATIONS_ENABLED === 'true',
    path: process.env.DB_MIGRATIONS_PATH || './migrations',
    collection: process.env.DB_MIGRATIONS_COLLECTION || 'migrations',
  },
  
  // Seeding settings
  seeding: {
    enabled: process.env.DB_SEEDING_ENABLED === 'true',
    path: process.env.DB_SEEDING_PATH || './seeds',
  },
  
  // Indexing
  indexing: {
    autoIndex: process.env.DB_AUTO_INDEX !== 'false',
    autoCreate: process.env.DB_AUTO_CREATE !== 'false',
  },
  
  // Debug mode
  debug: process.env.DB_DEBUG === 'true',
}));

export type DatabaseConfig = ReturnType<typeof databaseConfig>;