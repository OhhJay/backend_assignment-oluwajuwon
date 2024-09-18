import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'The name of the permission',
    example: 'ReadAccess',
  })
  @IsNotEmpty()
  @IsString()
  name: string; // The name is required and must be a string

  @ApiProperty({
    description: 'Optional description of the permission',
    example: 'Allows read access to resources',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string; // Optional description field
}
