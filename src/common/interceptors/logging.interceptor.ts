import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, headers, body, query, params } = request;
    
    // Generate request ID if not present
    const requestId = headers['x-request-id'] || uuidv4();
    request.headers['x-request-id'] = requestId;
    response.setHeader('x-request-id', requestId);

    const startTime = Date.now();
    const userAgent = headers['user-agent'] || 'Unknown';
    const ip = request.ip || request.connection.remoteAddress || 'Unknown';

    // Log request
    this.logger.log(
      `Incoming Request: ${method} ${url}`,
      {
        requestId,
        method,
        url,
        ip,
        userAgent,
        headers: this.sanitizeHeaders(headers),
        body: this.sanitizeBody(body),
        query,
        params,
        timestamp: new Date().toISOString(),
      }
    );

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        const { statusCode } = response;

        // Log successful response
        this.logger.log(
          `Outgoing Response: ${method} ${url} ${statusCode} ${duration}ms`,
          {
            requestId,
            method,
            url,
            statusCode,
            duration,
            responseSize: JSON.stringify(data).length,
            timestamp: new Date().toISOString(),
          }
        );
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const statusCode = error.status || 500;

        // Log error response
        this.logger.error(
          `Error Response: ${method} ${url} ${statusCode} ${duration}ms`,
          {
            requestId,
            method,
            url,
            statusCode,
            duration,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
          }
        );

        throw error;
      })
    );
  }

  private sanitizeHeaders(headers: any): any {
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    const sanitized = { ...headers };

    sensitiveHeaders.forEach((header) => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = ['password', 'token', 'secret', 'key', 'apiKey'];
    const sanitized = { ...body };

    const sanitizeObject = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }

      const result = Array.isArray(obj) ? [] : {};

      for (const key in obj) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
          result[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object') {
          result[key] = sanitizeObject(obj[key]);
        } else {
          result[key] = obj[key];
        }
      }

      return result;
    };

    return sanitizeObject(sanitized);
  }
}