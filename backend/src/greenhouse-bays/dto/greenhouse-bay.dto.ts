import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BayStatus, BayClimateType } from '@prisma/client';

export class CreateGreenhouseBayDto {
  @IsString()
  name: string;

  @IsString()
  zone: string;

  @IsOptional()
  @IsEnum(BayClimateType)
  climateType?: BayClimateType;

  @IsOptional()
  @IsString()
  irrigationSystem?: string;

  @IsOptional()
  @IsEnum(BayStatus)
  status?: BayStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateGreenhouseBayDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsOptional()
  @IsEnum(BayClimateType)
  climateType?: BayClimateType;

  @IsOptional()
  @IsString()
  irrigationSystem?: string;

  @IsOptional()
  @IsEnum(BayStatus)
  status?: BayStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
