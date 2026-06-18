import { Module } from '@nestjs/common';
import { HarvestBatchesController } from './harvest-batches.controller';
import { HarvestBatchesService } from './harvest-batches.service';

@Module({
  controllers: [HarvestBatchesController],
  providers: [HarvestBatchesService],
})
export class HarvestBatchesModule {}
