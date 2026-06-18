import { Module } from '@nestjs/common';
import { IrrigationSchedulesController } from './irrigation-schedules.controller';
import { IrrigationSchedulesService } from './irrigation-schedules.service';

@Module({
  controllers: [IrrigationSchedulesController],
  providers: [IrrigationSchedulesService],
})
export class IrrigationSchedulesModule {}
