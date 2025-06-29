import { Injectable } from '@nestjs/common';
import { register, Counter, Histogram, Gauge } from 'prom-client';
import { LogLevel } from '../logs/schemas/log.schema';

@Injectable()
export class MetricsService {
  private logCounter: Counter<string>;
  private httpRequestDuration: Histogram<string>;
  private httpRequestTotal: Counter<string>;
  private activeConnections: Gauge<string>;

  constructor() {
    // Log metrics
    this.logCounter = new Counter({
      name: 'logs_total',
      help: 'Total number of logs',
      labelNames: ['level', 'service'],
    });

    // HTTP metrics
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
    });

    this.httpRequestTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    this.activeConnections = new Gauge({
      name: 'active_connections',
      help: 'Number of active connections',
    });

    register.registerMetric(this.logCounter);
    register.registerMetric(this.httpRequestDuration);
    register.registerMetric(this.httpRequestTotal);
    register.registerMetric(this.activeConnections);
  }

  incrementLogCounter(level: LogLevel, service: string) {
    this.logCounter.inc({ level, service });
  }

  recordHttpRequest(method: string, route: string, statusCode: string, duration: number) {
    this.httpRequestDuration.observe({ method, route, status_code: statusCode }, duration);
    this.httpRequestTotal.inc({ method, route, status_code: statusCode });
  }

  setActiveConnections(count: number) {
    this.activeConnections.set(count);
  }

  async getMetrics(): Promise<string> {
    return register.metrics();
  }
}