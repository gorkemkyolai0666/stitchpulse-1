import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { HarvestBatchesService } from './harvest-batches.service';
import { CreateHarvestBatchDto, UpdateHarvestBatchDto } from './dto/harvest-batch.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('harvest-batches')
@UseGuards(JwtAuthGuard)
export class HarvestBatchesController {
  constructor(private harvestBatchesService: HarvestBatchesService) {}

  @Get()
  list(
    @Request() req: { user: { nurseryId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.harvestBatchesService.list(req.user.nurseryId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { nurseryId: string } }, @Param('id') id: string) {
    return this.harvestBatchesService.get(req.user.nurseryId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { nurseryId: string } },
    @Body() dto: CreateHarvestBatchDto,
  ) {
    return this.harvestBatchesService.create(req.user.nurseryId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { nurseryId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateHarvestBatchDto,
  ) {
    return this.harvestBatchesService.update(req.user.nurseryId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { nurseryId: string } }, @Param('id') id: string) {
    return this.harvestBatchesService.remove(req.user.nurseryId, id);
  }
}
