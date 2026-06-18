import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { HarvestType, HarvestStatus } from '@prisma/client';

export class CreateHarvestBatchDto {
  @IsUUID()
  greenhouseBayId: string;

  @IsOptional()
  @IsDateString()
  harvestedAt?: string;

  @IsOptional()
  @IsEnum(HarvestType)
  harvestType?: HarvestType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cashSales?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cardSales?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  unitCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rushPremium?: number;

  @IsOptional()
  @IsEnum(HarvestStatus)
  status?: HarvestStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateHarvestBatchDto {
  @IsOptional()
  @IsUUID()
  greenhouseBayId?: string;

  @IsOptional()
  @IsDateString()
  harvestedAt?: string;

  @IsOptional()
  @IsEnum(HarvestType)
  harvestType?: HarvestType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cashSales?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cardSales?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  unitCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rushPremium?: number;

  @IsOptional()
  @IsEnum(HarvestStatus)
  status?: HarvestStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
