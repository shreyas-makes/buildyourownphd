import { Controller, Get } from '@nestjs/common'
import { SupabaseService } from '../database/supabase.service'
import { defaultLogger, HealthCheckResult } from '@buildyourownphd/utils'

@Controller('health')
export class HealthController {
  constructor(private supabaseService: SupabaseService) {}

  @Get()
  async check(): Promise<HealthCheckResult> {
    const uptime = process.uptime()
    const timestamp = new Date().toISOString()
    
    // Check database health
    const databaseHealth = await this.supabaseService.healthCheck()
    
    const healthData: HealthCheckResult = {
      status: databaseHealth.status === 'up' ? 'healthy' : 'degraded',
      timestamp,
      version: process.env.npm_package_version || '1.0.0',
      uptime,
      checks: {
        database: {
          status: databaseHealth.status,
          responseTime: databaseHealth.responseTime,
        },
        storage: {
          status: 'up', // TODO: Implement storage health check
        },
        ai_services: {
          status: 'up', // TODO: Implement AI services health check
        },
        queue: {
          status: 'up', // TODO: Implement queue health check
        },
      },
    }

    defaultLogger.debug('Health check performed', healthData)
    return healthData
  }

  @Get('ready')
  async ready() {
    // Add readiness checks here (database, external services, etc.)
    const databaseHealth = await this.supabaseService.healthCheck()
    
    const isReady = databaseHealth.status === 'up'
    
    return {
      status: isReady ? 'ready' : 'not ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: databaseHealth.status,
      },
    }
  }

  @Get('live')
  live() {
    // Basic liveness check
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    }
  }
} 