import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthHelpers } from '../../shared/helpers/auth.helpers';
import { GLOBAL_CONFIG } from '../../configs/global.config';

import { AuthResponseDTO, LoginUserDTO, RegisterUserDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  public async login(loginUserDTO: LoginUserDTO): Promise<AuthResponseDTO> {
    const userData = await this.userService.findUser({
      email: loginUserDTO.email,
    });

    if (!userData) {
      throw new UnauthorizedException();
    }

    const isMatch = await AuthHelpers.verify(
      loginUserDTO.password,
      userData.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password: null,
    };

    const accessToken: string = this.jwtService.sign(payload, {
      expiresIn: GLOBAL_CONFIG.security.expiresIn,
    });

    const refreshToken = uuidv4();
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: userData.id,
      },
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  public async refreshToken(token: string): Promise<AuthResponseDTO> {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findUser({ id: refreshToken.userId });

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: null,
    };

    const accessToken: string = this.jwtService.sign(payload, {
      expiresIn: GLOBAL_CONFIG.security.expiresIn,
    });

    return {
      accessToken: accessToken,
      refreshToken: token,
    };
  }

  public async register(user: RegisterUserDTO): Promise<User> {
    return this.userService.createUser(user);
  }
}
