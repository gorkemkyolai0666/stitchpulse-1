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
import { PlantPricingService } from './plant-pricing.service';
import { CreatePlantPricingDto, UpdatePlantPricingDto } from './dto/rate-tier.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('plant-pricing')
@UseGuards(JwtAuthGuard)
export class PlantPricingController {
  constructor(private plantPricingsService: PlantPricingService) {}

  @Get()
  list(
    @Request() req: { user: { nurseryId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.plantPricingsService.list(req.user.nurseryId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { nurseryId: string } }, @Param('id') id: string) {
    return this.plantPricingsService.get(req.user.nurseryId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { nurseryId: string } },
    @Body() dto: CreatePlantPricingDto,
  ) {
    return this.plantPricingsService.create(req.user.nurseryId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { nurseryId: string } },
    @Param('id') id: string,
    @Body() dto: UpdatePlantPricingDto,
  ) {
    return this.plantPricingsService.update(req.user.nurseryId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { nurseryId: string } }, @Param('id') id: string) {
    return this.plantPricingsService.remove(req.user.nurseryId, id);
  }
}
