import { SetMetadata } from '@nestjs/common';

export const METRICS_KEY = 'metrics';

export interface MetricsOptions {
  name?: string;
  description?: string;
  labels?: string[];
  histogram?: boolean;
  counter?: boolean;
}

/**
 * Decorator to add metrics collection to methods
 */
export const Metrics = (options: MetricsOptions = {}) => {
  return SetMetadata(METRICS_KEY, options);
};

/**
 * Decorator to track method execution time
 */
export const TrackExecutionTime = (metricName?: string) => {
  return SetMetadata(METRICS_KEY, {
    name: metricName,
    histogram: true,
    description: 'Method execution time in seconds',
  });
};

/**
 * Decorator to count method invocations
 */
export const CountInvocations = (metricName?: string) => {
  return SetMetadata(METRICS_KEY, {
    name: metricName,
    counter: true,
    description: 'Number of method invocations',
  });
};