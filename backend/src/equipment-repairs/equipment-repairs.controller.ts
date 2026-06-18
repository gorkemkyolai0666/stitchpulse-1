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
import { EquipmentRepairsService } from './equipment-repairs.service';
import {
  CreateEquipmentRepairDto,
  UpdateEquipmentRepairDto,
} from './dto/equipment-repair.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('equipment-repairs')
@UseGuards(JwtAuthGuard)
export class EquipmentRepairsController {
  constructor(private equipmentRepairService: EquipmentRepairsService) {}

  @Get()
  list(
    @Request() req: { user: { nurseryId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.equipmentRepairService.list(req.user.nurseryId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      priority,
    });
  }

  @Get('urgent')
  urgent(@Request() req: { user: { nurseryId: string } }) {
    return this.equipmentRepairService.urgent(req.user.nurseryId);
  }

  @Get(':id')
  get(@Request() req: { user: { nurseryId: string } }, @Param('id') id: string) {
    return this.equipmentRepairService.get(req.user.nurseryId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { nurseryId: string } },
    @Body() dto: CreateEquipmentRepairDto,
  ) {
    return this.equipmentRepairService.create(req.user.nurseryId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { nurseryId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateEquipmentRepairDto,
  ) {
    return this.equipmentRepairService.update(req.user.nurseryId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { nurseryId: string } }, @Param('id') id: string) {
    return this.equipmentRepairService.remove(req.user.nurseryId, id);
  }
}
