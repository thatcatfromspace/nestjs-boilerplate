import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/auth.jwt.guard';

import { UserService } from './user.service';
import { UserDTO, UserResponseDTO } from './dto/user.dto';

@ApiTags('users')
@ApiExtraModels(UserResponseDTO)
@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOkResponse({
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(UserResponseDTO),
      },
    },
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  getAll(): Promise<User[]> {
    return this.userService.users({});
  }

  @ApiExtraModels(UserResponseDTO)
  @ApiResponse({
    status: 201,
    schema: {
      $ref: getSchemaPath(UserResponseDTO),
    },
  })
  @Post()
  async signupUser(@Body() userData: UserDTO): Promise<User> {
    return this.userService.createUser(userData);
  }
}
