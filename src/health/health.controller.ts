import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MongooseHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongoose: MongooseHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Get application health status' })
  @ApiResponse({ 
    status: 200, 
    description: 'Health check successful',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        info: { type: 'object' },
        error: { type: 'object' },
        details: { type: 'object' },
      },
    },
  })
  @ApiResponse({ 
    status: 503, 
    description: 'Health check failed',
  })
  check() {
    const healthChecks = [];

    // Database health check
    if (this.configService.get('monitoring.health.database.enabled')) {
      healthChecks.push(() =>
        this.mongoose.pingCheck('database', {
          timeout: this.configService.get('monitoring.health.database.timeout'),
        }),
      );
    }

    // Memory health check
    if (this.configService.get('monitoring.health.memory.enabled')) {
      healthChecks.push(() =>
        this.memory.checkHeap('memory_heap', 
          this.configService.get('monitoring.health.memory.thresholdHeap')
        ),
      );

      healthChecks.push(() =>
        this.memory.checkRSS('memory_rss', 
          this.configService.get('monitoring.health.memory.thresholdRSS')
        ),
      );
    }

    // Disk health check
    if (this.configService.get('monitoring.health.disk.enabled')) {
      healthChecks.push(() =>
        this.disk.checkStorage('storage', {
          path: this.configService.get('monitoring.health.disk.path'),
          thresholdPercent: this.configService.get('monitoring.health.disk.thresholdPercent'),
        }),
      );
    }

    return this.health.check(healthChecks);
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiResponse({ status: 200, description: 'Application is alive' })
  live() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      message: 'Application is alive',
    };
  }

  @Get('ready')
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness probe' })
  @ApiResponse({ status: 200, description: 'Application is ready' })
  @ApiResponse({ status: 503, description: 'Application is not ready' })
  ready() {
    return this.health.check([
      () => this.mongoose.pingCheck('database'),
    ]);
  }

  @Get('info')
  @ApiOperation({ summary: 'Get application information' })
  @ApiResponse({ status: 200, description: 'Application information' })
  info() {
    return {
      name: this.configService.get('app.name'),
      version: this.configService.get('app.version'),
      environment: this.configService.get('app.nodeEnv'),
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      versions: process.versions,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
    };
  }
}