import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MetricsService } from '../../metrics/metrics.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private metricsService: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000;
      const { method, url } = req;
      const { statusCode } = res;

      this.metricsService.recordHttpRequest(
        method,
        url,
        statusCode.toString(),
        duration,
      );

      console.log(
        `${method} ${url} ${statusCode} - ${duration.toFixed(3)}s`,
      );
    });

    next();
  }
}