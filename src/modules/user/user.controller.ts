import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiOkResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/auth.jwt.guard';

import { UserService } from './user.service';
import { UserDto, UserResponseDto } from './dto/user.dto';

@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOkResponse({
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(UserResponseDto),
      },
    },
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  getAll(): Promise<User[]> {
    return this.userService.users({});
  }

  @ApiOkResponse({
    schema: {
      $ref: getSchemaPath(UserResponseDto),
    },
  })
  @Post('user')
  async signupUser(@Body() userData: UserDto): Promise<User> {
    return this.userService.createUser(userData);
  }
}
