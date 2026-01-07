import { db } from '../db';
import { sql } from 'drizzle-orm';

export interface ServiceStatus {
  status: 'ok' | 'error';
  message?: string;
  responseTime?: number;
}

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  services: {
    backend: ServiceStatus;
    database: ServiceStatus;
    frontend: ServiceStatus;
  };
}

export async function checkDatabaseHealth(): Promise<ServiceStatus> {
  const startTime = Date.now();
  try {
    await db.execute(sql`SELECT 1`);
    const responseTime = Date.now() - startTime;
    return {
      status: 'ok',
      message: 'Database is connected',
      responseTime
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Database connection failed',
      responseTime
    };
  }
}

export async function checkFrontendHealth(): Promise<ServiceStatus> {
  const startTime = Date.now();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(frontendUrl, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      return {
        status: 'ok',
        message: 'Frontend is reachable',
        responseTime
      };
    } else {
      return {
        status: 'error',
        message: `Frontend returned status ${response.status}`,
        responseTime
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Frontend is not reachable',
      responseTime
    };
  }
}

export async function performHealthCheck(): Promise<HealthCheckResponse> {
  const [databaseStatus, frontendStatus] = await Promise.all([
    checkDatabaseHealth(),
    checkFrontendHealth()
  ]);

  const backendStatus: ServiceStatus = {
    status: 'ok',
    message: 'Backend is running'
  };

  let overallStatus: 'ok' | 'degraded' | 'error' = 'ok';
  
  if (databaseStatus.status === 'error' && frontendStatus.status === 'error') {
    overallStatus = 'error';
  } else if (databaseStatus.status === 'error' || frontendStatus.status === 'error') {
    overallStatus = 'degraded';
  }

  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    services: {
      backend: backendStatus,
      database: databaseStatus,
      frontend: frontendStatus
    }
  };
}
