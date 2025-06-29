import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as os from 'os';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello() {
    return {
      name: this.configService.get('app.name'),
      version: this.configService.get('app.version'),
      description: 'API for log monitoring and observability with Grafana, Prometheus integration',
      environment: this.configService.get('app.nodeEnv'),
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      endpoints: {
        health: '/api/v1/health',
        metrics: '/api/v1/metrics',
        logs: '/api/v1/logs',
        documentation: '/api/docs',
      },
      features: [
        'Log aggregation and storage',
        'Real-time metrics collection',
        'Prometheus integration',
        'Grafana dashboard support',
        'Health monitoring',
        'RESTful API',
        'Swagger documentation',
      ],
    };
  }

  getVersion() {
    return {
      version: this.configService.get('app.version'),
      buildDate: process.env.BUILD_DATE || new Date().toISOString(),
      commit: process.env.GIT_COMMIT || 'unknown',
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    };
  }

  getStatus() {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        rss: this.formatBytes(memoryUsage.rss),
        heapTotal: this.formatBytes(memoryUsage.heapTotal),
        heapUsed: this.formatBytes(memoryUsage.heapUsed),
        external: this.formatBytes(memoryUsage.external),
        arrayBuffers: this.formatBytes(memoryUsage.arrayBuffers),
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
        loadAverage: os.loadavg(),
        cores: os.cpus().length,
      },
      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        totalMemory: this.formatBytes(os.totalmem()),
        freeMemory: this.formatBytes(os.freemem()),
        hostname: os.hostname(),
      },
      environment: {
        nodeEnv: this.configService.get('app.nodeEnv'),
        port: this.configService.get('app.port'),
        database: 'connected', // This could be dynamic based on actual DB status
      },
    };
  }

  private formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}