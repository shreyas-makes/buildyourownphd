import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto, RefreshTokenDto } from './dto/auth.dto';
import { defaultLogger, ApiResponse } from '@buildyourownphd/utils';

@Controller('auth')
export class AuthController {
  private logger = defaultLogger;

  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto): Promise<ApiResponse> {
    this.logger.info('Sign up attempt', { email: signUpDto.email });
    
    const result = await this.authService.signUp(signUpDto);
    
    return {
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.user_metadata?.first_name,
          lastName: result.user.user_metadata?.last_name,
        },
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      },
      requestId: '',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto): Promise<ApiResponse> {
    this.logger.info('Sign in attempt', { email: signInDto.email });
    
    const result = await this.authService.signIn(signInDto);
    
    return {
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.user_metadata?.first_name,
          lastName: result.user.user_metadata?.last_name,
        },
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      },
      requestId: '',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('signout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async signOut(): Promise<void> {
    this.logger.info('Sign out attempt');
    await this.authService.signOut('');
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<ApiResponse> {
    this.logger.info('Token refresh attempt');
    
    const result = await this.authService.refreshToken(refreshTokenDto.refreshToken);
    
    return {
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.user_metadata?.first_name,
          lastName: result.user.user_metadata?.last_name,
        },
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      },
      requestId: '',
      timestamp: new Date().toISOString(),
    };
  }
} 