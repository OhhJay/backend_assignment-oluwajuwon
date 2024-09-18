import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsString()
  @Length(1, 255)
  firstname: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  @Length(1, 255)
  lastname: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the user' })
  @IsEmail()
  @Length(1, 255)
  email: string;

  @ApiProperty({ example: 'some-random-token', description: 'Token for the user', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 65535)
  token?: string;

  @ApiProperty({ example: 'password123', description: 'Password for the user' })
  @IsString()
  @Length(8, 65535)
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
