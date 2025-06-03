import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import databaseConfig from '../config/database.config';
import { defaultLogger } from '@buildyourownphd/utils';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private logger = defaultLogger;

  constructor(
    @Inject(databaseConfig.KEY)
    private config: ConfigType<typeof databaseConfig>,
  ) {
    this.supabase = createClient(
      this.config.url,
      this.config.serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    this.logger.info('Supabase service initialized', {
      url: this.config.url,
      hasServiceKey: !!this.config.serviceRoleKey,
    });
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  async healthCheck(): Promise<{ status: 'up' | 'down'; responseTime?: number }> {
    const start = Date.now();
    
    try {
      // Simple query to check database connectivity
      const { error } = await this.supabase
        .from('users')
        .select('count')
        .limit(1);

      const responseTime = Date.now() - start;

      if (error) {
        this.logger.error('Supabase health check failed', error);
        return { status: 'down' };
      }

      return { status: 'up', responseTime };
    } catch (error) {
      this.logger.error('Supabase health check error', error);
      return { status: 'down' };
    }
  }

  // User management methods
  async createUser(email: string, password: string) {
    const { data, error } = await this.supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      this.logger.error('Failed to create user', error);
      throw error;
    }

    return data;
  }

  async getUserById(userId: string) {
    const { data, error } = await this.supabase.auth.admin.getUserById(userId);

    if (error) {
      this.logger.error('Failed to get user by ID', error);
      throw error;
    }

    return data;
  }

  async deleteUser(userId: string) {
    const { error } = await this.supabase.auth.admin.deleteUser(userId);

    if (error) {
      this.logger.error('Failed to delete user', error);
      throw error;
    }

    return true;
  }

  // Database query methods
  async query(table: string) {
    return this.supabase.from(table);
  }

  async storage() {
    return this.supabase.storage;
  }
} 