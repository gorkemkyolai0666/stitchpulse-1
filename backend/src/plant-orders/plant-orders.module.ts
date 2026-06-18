import { Module } from '@nestjs/common';
import { PlantOrdersController } from './plant-orders.controller';
import { PlantOrdersService } from './plant-orders.service';

@Module({
  controllers: [PlantOrdersController],
  providers: [PlantOrdersService],
})
export class PlantOrdersModule {}
