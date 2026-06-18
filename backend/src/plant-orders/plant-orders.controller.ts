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
import { PlantOrdersService } from './plant-orders.service';
import { CreatePlantOrderDto, UpdatePlantOrderDto } from './dto/plant-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('plant-orders')
@UseGuards(JwtAuthGuard)
export class PlantOrdersController {
  constructor(private plantOrdersService: PlantOrdersService) {}

  @Get()
  list(
    @Request() req: { user: { nurseryId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('plantVariety') plantVariety?: string,
  ) {
    return this.plantOrdersService.list(req.user.nurseryId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      plantVariety,
    });
  }

  @Get('pending')
  pending(@Request() req: { user: { nurseryId: string } }) {
    return this.plantOrdersService.pending(req.user.nurseryId);
  }

  @Get(':id')
  get(@Request() req: { user: { nurseryId: string } }, @Param('id') id: string) {
    return this.plantOrdersService.get(req.user.nurseryId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { nurseryId: string } },
    @Body() dto: CreatePlantOrderDto,
  ) {
    return this.plantOrdersService.create(req.user.nurseryId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { nurseryId: string } },
    @Param('id') id: string,
    @Body() dto: UpdatePlantOrderDto,
  ) {
    return this.plantOrdersService.update(req.user.nurseryId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { nurseryId: string } }, @Param('id') id: string) {
    return this.plantOrdersService.remove(req.user.nurseryId, id);
  }
}
