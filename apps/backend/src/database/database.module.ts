import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';
import databaseConfig from '../config/database.config';

@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class DatabaseModule {} 