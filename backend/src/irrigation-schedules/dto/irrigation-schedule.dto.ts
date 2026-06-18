import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { IrrigationCategory, ScheduleStatus } from '@prisma/client';

export class CreateIrrigationScheduleDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(IrrigationCategory)
  category?: IrrigationCategory;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;
}

export class UpdateIrrigationScheduleDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(IrrigationCategory)
  category?: IrrigationCategory;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;
}
