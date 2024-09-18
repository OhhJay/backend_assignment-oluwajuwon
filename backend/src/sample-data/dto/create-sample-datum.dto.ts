 import { IsString, IsOptional, IsInt, IsDateString } from 'class-validator';
export class CreateSampleDatumDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @IsOptional()
  @IsDateString()
  updatedAt?: string;

  @IsOptional()
  @IsInt()
  uploadedBy?: number;

  @IsOptional()
  @IsString()
  sensitiveData?: string;
}
