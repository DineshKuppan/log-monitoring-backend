import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './auth/decorators/auth.decorator';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get application information' })
  @ApiResponse({
    status: 200,
    description: 'Application information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Log Monitoring Backend' },
        version: { type: 'string', example: '1.0.0' },
        description: { type: 'string', example: 'API for log monitoring and observability' },
        environment: { type: 'string', example: 'development' },
        timestamp: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 123.456 },
        endpoints: { type: 'object' },
      },
    },
  })
  getHello() {
    return this.appService.getHello();
  }

  @Get('version')
  @Public()
  @ApiOperation({ summary: 'Get application version' })
  @ApiResponse({
    status: 200,
    description: 'Application version retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        version: { type: 'string', example: '1.0.0' },
        buildDate: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
        commit: { type: 'string', example: 'abc123' },
        nodeVersion: { type: 'string', example: 'v18.17.0' },
      },
    },
  })
  getVersion() {
    return this.appService.getVersion();
  }

  @Get('status')
  @Public()
  @ApiOperation({ summary: 'Get application status' })
  @ApiResponse({
    status: 200,
    description: 'Application status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'healthy' },
        timestamp: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 123.456 },
        memory: { type: 'object' },
        cpu: { type: 'object' },
      },
    },
  })
  getStatus() {
    return this.appService.getStatus();
  }
}