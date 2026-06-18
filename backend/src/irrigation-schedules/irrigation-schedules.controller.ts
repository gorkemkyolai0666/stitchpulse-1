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
import { IrrigationSchedulesService } from './irrigation-schedules.service';
import { CreateIrrigationScheduleDto, UpdateIrrigationScheduleDto } from './dto/irrigation-schedule.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('irrigation-schedules')
@UseGuards(JwtAuthGuard)
export class IrrigationSchedulesController {
  constructor(private irrigationScheduleService: IrrigationSchedulesService) {}

  @Get()
  list(
    @Request() req: { user: { nurseryId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.irrigationScheduleService.list(req.user.nurseryId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { nurseryId: string } }, @Param('id') id: string) {
    return this.irrigationScheduleService.get(req.user.nurseryId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { nurseryId: string } },
    @Body() dto: CreateIrrigationScheduleDto,
  ) {
    return this.irrigationScheduleService.create(req.user.nurseryId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { nurseryId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateIrrigationScheduleDto,
  ) {
    return this.irrigationScheduleService.update(req.user.nurseryId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { nurseryId: string } }, @Param('id') id: string) {
    return this.irrigationScheduleService.remove(req.user.nurseryId, id);
  }
}
