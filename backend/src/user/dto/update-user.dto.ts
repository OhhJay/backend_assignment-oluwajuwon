import { IsString, IsEmail, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  firstname?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  lastname?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 255)
  email?: string;

  @IsOptional()
  @IsString() 
  token?: string;

  @IsOptional()
  @IsString() // Adjust the length as needed
  password?: string;
}
