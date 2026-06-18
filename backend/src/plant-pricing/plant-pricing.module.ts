import { Module } from '@nestjs/common';
import { PlantPricingController } from './plant-pricing.controller';
import { PlantPricingService } from './plant-pricing.service';

@Module({
  controllers: [PlantPricingController],
  providers: [PlantPricingService],
})
export class PlantPricingModule {}
