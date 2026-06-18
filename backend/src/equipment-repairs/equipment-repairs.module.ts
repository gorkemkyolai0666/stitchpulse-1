import { Module } from '@nestjs/common';
import { EquipmentRepairsController } from './equipment-repairs.controller';
import { EquipmentRepairsService } from './equipment-repairs.service';

@Module({
  controllers: [EquipmentRepairsController],
  providers: [EquipmentRepairsService],
})
export class EquipmentRepairsModule {}
