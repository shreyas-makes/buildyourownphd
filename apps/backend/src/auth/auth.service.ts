import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { defaultLogger, AppError, ErrorCodes } from '@buildyourownphd/utils';

export interface SignUpDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: any;
  session: any;
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  private logger = defaultLogger;

  constructor(private supabaseService: SupabaseService) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    try {
      const { email, password, firstName, lastName } = signUpDto;
      const supabase = this.supabaseService.getClient();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        this.logger.error('Sign up failed', error);
        throw new BadRequestException(error.message);
      }

      if (!data.user || !data.session) {
        throw new BadRequestException('User creation failed');
      }

      this.logger.info('User signed up successfully', {
        userId: data.user.id,
        email: data.user.email,
      });

      return {
        user: data.user,
        session: data.session,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Unexpected error during sign up', error);
      throw new AppError('Sign up failed', ErrorCodes.BAD_REQUEST, 400);
    }
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    try {
      const { email, password } = signInDto;
      const supabase = this.supabaseService.getClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        this.logger.error('Sign in failed', error);
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!data.user || !data.session) {
        throw new UnauthorizedException('Authentication failed');
      }

      this.logger.info('User signed in successfully', {
        userId: data.user.id,
        email: data.user.email,
      });

      return {
        user: data.user,
        session: data.session,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Unexpected error during sign in', error);
      throw new AppError('Sign in failed', ErrorCodes.UNAUTHORIZED, 401);
    }
  }

  async signOut(accessToken: string): Promise<void> {
    try {
      const supabase = this.supabaseService.getClient();
      
      const { error } = await supabase.auth.signOut();

      if (error) {
        this.logger.error('Sign out failed', error);
        throw new AppError('Sign out failed', ErrorCodes.BAD_REQUEST, 400);
      }

      this.logger.info('User signed out successfully');
    } catch (error) {
      this.logger.error('Unexpected error during sign out', error);
      throw new AppError('Sign out failed', ErrorCodes.INTERNAL_SERVER_ERROR, 500);
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const supabase = this.supabaseService.getClient();

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) {
        this.logger.error('Token refresh failed', error);
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (!data.user || !data.session) {
        throw new UnauthorizedException('Token refresh failed');
      }

      this.logger.info('Token refreshed successfully', {
        userId: data.user.id,
      });

      return {
        user: data.user,
        session: data.session,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Unexpected error during token refresh', error);
      throw new AppError('Token refresh failed', ErrorCodes.AUTHENTICATION_ERROR, 401);
    }
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const supabase = this.supabaseService.getClient();

      const { data, error } = await supabase.auth.getUser(token);

      if (error) {
        this.logger.error('Token verification failed', error);
        throw new UnauthorizedException('Invalid token');
      }

      return data.user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Unexpected error during token verification', error);
      throw new AppError('Token verification failed', ErrorCodes.AUTHENTICATION_ERROR, 401);
    }
  }
} 