import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PlantCategory, PricingStatus } from '@prisma/client';

export class CreatePlantPricingDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(PlantCategory)
  plantCategory?: PlantCategory;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMultiplier?: number;

  @IsOptional()
  @IsEnum(PricingStatus)
  status?: PricingStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePlantPricingDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(PlantCategory)
  plantCategory?: PlantCategory;

  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMultiplier?: number;

  @IsOptional()
  @IsEnum(PricingStatus)
  status?: PricingStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
