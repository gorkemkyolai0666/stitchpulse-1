import { Module } from '@nestjs/common';
import { GreenhouseBaysController } from './greenhouse-bays.controller';
import { GreenhouseBaysService } from './greenhouse-bays.service';

@Module({
  controllers: [GreenhouseBaysController],
  providers: [GreenhouseBaysService],
})
export class GreenhouseBaysModule {}
