import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { NurseryService } from './nursery.service';
import { UpdateNurseryDto } from './dto/update-nursery.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('nursery')
@UseGuards(JwtAuthGuard)
export class NurseryController {
  constructor(private nurseryService: NurseryService) {}

  @Get()
  get(@Request() req: { user: { nurseryId: string } }) {
    return this.nurseryService.get(req.user.nurseryId);
  }

  @Patch()
  update(
    @Request() req: { user: { nurseryId: string } },
    @Body() dto: UpdateNurseryDto,
  ) {
    return this.nurseryService.update(req.user.nurseryId, dto);
  }
}
