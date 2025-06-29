import { SetMetadata, createParamDecorator, ExecutionContext, applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { Request } from 'express';

// Metadata keys for decorators
export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';
export const AUTH_OPTIONAL_KEY = 'authOptional';

/**
 * Mark endpoint as public (no authentication required)
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * Mark endpoint as requiring optional authentication
 * User will be attached to request if token is valid, but endpoint won't fail if no token
 */
export const OptionalAuth = () => SetMetadata(AUTH_OPTIONAL_KEY, true);

/**
 * Require specific roles for endpoint access
 * @param roles - Array of required roles
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Require specific permissions for endpoint access
 * @param permissions - Array of required permissions
 */
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * Get current authenticated user from request
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request:any = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);

/**
 * Get user ID from authenticated user
 */
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request:any = ctx.switchToHttp().getRequest<Request>();
    return request.user?.id;
  },
);

/**
 * Get user email from authenticated user
 */
export const UserEmail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request:any = ctx.switchToHttp().getRequest<Request>();
    return request.user?.email;
  },
);

/**
 * Get user roles from authenticated user
 */
export const UserRoles = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string[] => {
    const request:any = ctx.switchToHttp().getRequest<Request>();
    return request?.user.roles || [];
  },
);

/**
 * Get request ID from headers (for tracing)
 */
export const RequestId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.headers['x-request-id'] as string || 'unknown';
  },
);

/**
 * Combined decorator for authenticated endpoints
 * Applies authentication guard and Swagger documentation
 */
export function Auth(...roles: string[]) {
  const decorators = [
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Authentication required' }),
  ];

  if (roles.length > 0) {
    decorators.push(
      Roles(...roles),
      ApiForbiddenResponse({ description: 'Insufficient permissions' }),
    );
  }

  return applyDecorators(...decorators);
}

/**
 * Admin only endpoint decorator
 */
export function AdminOnly() {
  return applyDecorators(
    Auth('admin'),
    ApiForbiddenResponse({ description: 'Admin access required' }),
  );
}

/**
 * Manager or Admin endpoint decorator
 */
export function ManagerOrAdmin() {
  return applyDecorators(
    Auth('manager', 'admin'),
    ApiForbiddenResponse({ description: 'Manager or Admin access required' }),
  );
}

/**
 * User, Manager or Admin endpoint decorator
 */
export function AuthenticatedUser() {
  return applyDecorators(
    Auth('user', 'manager', 'admin'),
    ApiForbiddenResponse({ description: 'User authentication required' }),
  );
}

/**
 * API Key authentication decorator (alternative to bearer token)
 */
export const ApiKeyAuth = () => SetMetadata('apiKeyAuth', true);

/**
 * Rate limiting decorator metadata
 */
export const RateLimit = (limit: number, windowMs: number = 60000) => 
  SetMetadata('rateLimit', { limit, windowMs });

/**
 * Audit logging decorator - logs all access to sensitive endpoints
 */
export const AuditLog = (action: string, resource?: string) => 
  SetMetadata('auditLog', { action, resource });

/**
 * IP Whitelist decorator - restrict access to specific IP addresses
 */
export const IPWhitelist = (...allowedIPs: string[]) => 
  SetMetadata('ipWhitelist', allowedIPs);

/**
 * Feature flag decorator - enable/disable endpoints based on feature flags
 */
export const FeatureFlag = (flagName: string) => 
  SetMetadata('featureFlag', flagName);

/**
 * Combine multiple auth decorators for complex authorization scenarios
 */
export function ComplexAuth(options: {
  roles?: string[];
  permissions?: string[];
  rateLimit?: { limit: number; windowMs?: number };
  auditLog?: { action: string; resource?: string };
  ipWhitelist?: string[];
  featureFlag?: string;
}) {
  const decorators = [Auth()];

  if (options.roles?.length) {
    decorators.push(Roles(...options.roles));
  }

  if (options.permissions?.length) {
    decorators.push(Permissions(...options.permissions));
  }

  if (options.rateLimit) {
    decorators.push(RateLimit(options.rateLimit.limit, options.rateLimit.windowMs));
  }

  if (options.auditLog) {
    decorators.push(AuditLog(options.auditLog.action, options.auditLog.resource));
  }

  if (options.ipWhitelist?.length) {
    decorators.push(IPWhitelist(...options.ipWhitelist));
  }

  if (options.featureFlag) {
    decorators.push(FeatureFlag(options.featureFlag));
  }

  return applyDecorators(...decorators);
}

/**
 * Self-service decorator - user can only access their own resources
 * Compares user ID with resource owner ID
 */
export const SelfOnly = () => SetMetadata('selfOnly', true);

/**
 * Resource owner decorator - user can access resource if they own it or have elevated permissions
 */
export const ResourceOwner = (ownerField: string = 'userId') => 
  SetMetadata('resourceOwner', ownerField);

/**
 * Time-based access decorator - restrict access to specific time windows
 */
export const TimeWindow = (startHour: number, endHour: number, timezone: string = 'UTC') => 
  SetMetadata('timeWindow', { startHour, endHour, timezone });

/**
 * Environment-based access decorator - restrict access based on environment
 */
export const EnvironmentAccess = (...environments: string[]) => 
  SetMetadata('environmentAccess', environments);

// Type definitions for better TypeScript support
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions?: string[];
  azureId?: string;
  tenantId?: string;
  lastLogin?: Date;
  isActive: boolean;
}

export interface RequestWithUser extends Request {
  user: AuthUser;
}

// Helper function to check if user has specific role
export function hasRole(user: AuthUser, role: string): boolean {
  return user.roles.includes(role);
}

// Helper function to check if user has any of the specified roles
export function hasAnyRole(user: AuthUser, roles: string[]): boolean {
  return roles.some(role => user.roles.includes(role));
}

// Helper function to check if user has all specified roles
export function hasAllRoles(user: AuthUser, roles: string[]): boolean {
  return roles.every(role => user.roles.includes(role));
}

// Helper function to check if user has specific permission
export function hasPermission(user: AuthUser, permission: string): boolean {
  return user.permissions?.includes(permission) || false;
}

// Helper function to check if user has any of the specified permissions
export function hasAnyPermission(user: AuthUser, permissions: string[]): boolean {
  return permissions.some(permission => user.permissions?.includes(permission));
}

// Helper function to check if user is admin
export function isAdmin(user: AuthUser): boolean {
  return hasRole(user, 'admin');
}

// Helper function to check if user is manager or admin
export function isManagerOrAdmin(user: AuthUser): boolean {
  return hasAnyRole(user, ['manager', 'admin']);
}

// Constants for common roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  VIEWER: 'viewer',
  EDITOR: 'editor',
} as const;

// Constants for common permissions
export const PERMISSIONS = {
  READ_LOGS: 'read:logs',
  WRITE_LOGS: 'write:logs',
  DELETE_LOGS: 'delete:logs',
  READ_METRICS: 'read:metrics',
  READ_USERS: 'read:users',
  WRITE_USERS: 'write:users',
  DELETE_USERS: 'delete:users',
  ADMIN_ACCESS: 'admin:access',
  SYSTEM_CONFIG: 'system:config',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];