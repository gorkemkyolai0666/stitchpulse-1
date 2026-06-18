import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { NurseryModule } from './nursery/nursery.module';
import { GreenhouseBaysModule } from './greenhouse-bays/greenhouse-bays.module';
import { HarvestBatchesModule } from './harvest-batches/harvest-batches.module';
import { EquipmentRepairsModule } from './equipment-repairs/equipment-repairs.module';
import { IrrigationSchedulesModule } from './irrigation-schedules/irrigation-schedules.module';
import { PlantPricingModule } from './plant-pricing/plant-pricing.module';
import { PlantOrdersModule } from './plant-orders/plant-orders.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    NurseryModule,
    GreenhouseBaysModule,
    HarvestBatchesModule,
    EquipmentRepairsModule,
    IrrigationSchedulesModule,
    PlantPricingModule,
    PlantOrdersModule,
    DashboardModule,
  ],
})
export class AppModule {}
