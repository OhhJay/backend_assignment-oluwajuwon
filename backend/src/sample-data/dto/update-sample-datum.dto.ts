import { PartialType } from '@nestjs/swagger';
import { CreateSampleDatumDto } from './create-sample-datum.dto';
import { IsString, IsOptional, IsInt, IsDateString } from 'class-validator';

export class UpdateSampleDatumDto extends PartialType(CreateSampleDatumDto) {


  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;

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
