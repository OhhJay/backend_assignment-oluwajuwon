import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'Admin',
  })
  @IsNotEmpty()
  @IsString()
  name: string; // The name is required and must be a string

  @ApiProperty({
    description: 'Optional description of the role',
    example: 'Has full access to the system',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string; // Optional description field
}
