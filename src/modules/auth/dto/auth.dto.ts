import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { INVALID_EMAIL } from '../../../shared/constants/strings';

export class AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
}

export class RegisterUserDTO {
  @IsEmail({}, { message: INVALID_EMAIL })
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  password: string;
}

export class RefreshUserDTO {
  @IsString()
  @ApiProperty()
  refreshToken: string;
}

export class LoginUserDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail({}, { message: INVALID_EMAIL })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
