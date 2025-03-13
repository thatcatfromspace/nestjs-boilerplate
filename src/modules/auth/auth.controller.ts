import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { JWT_EXPIRY_SECONDS } from '../../shared/constants/global.constants';

import { AuthService } from './auth.service';
import {
  AuthResponseDTO,
  LoginUserDTO,
  RefreshUserDTO,
  RegisterUserDTO,
} from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ description: 'Login user' })
  @ApiBody({ type: LoginUserDTO })
  @ApiResponse({ type: AuthResponseDTO })
  async login(
    @Body() user: LoginUserDTO,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    const loginData: AuthResponseDTO = await this.authService.login(user);

    res.cookie('accessToken', loginData.accessToken, {
      expires: new Date(new Date().getTime() + JWT_EXPIRY_SECONDS * 1000),
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
    });

    res.status(200).send(loginData);
  }

  @Post('register')
  async register(@Body() user: RegisterUserDTO): Promise<User> {
    return this.authService.register(user);
  }

  @Post('refresh-token')
  @ApiBody({ type: RefreshUserDTO })
  @ApiResponse({ type: AuthResponseDTO })
  async refreshToken(
    @Body() refreshTokenDTO: RefreshUserDTO,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    const refreshData: AuthResponseDTO = await this.authService.refreshToken(
      refreshTokenDTO.refreshToken,
    );

    res.cookie('accessToken', refreshData.accessToken, {
      expires: new Date(new Date().getTime() + JWT_EXPIRY_SECONDS * 1000),
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
    });

    res.status(200).send(refreshData);
  }

  @Post('logout')
  logout(@Res() res: ExpressResponse): void {
    res.clearCookie('accessToken');
    res.status(200).send({ success: true });
  }
}
