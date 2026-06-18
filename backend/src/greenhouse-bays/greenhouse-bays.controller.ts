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
import { GreenhouseBaysService } from './greenhouse-bays.service';
import { CreateGreenhouseBayDto, UpdateGreenhouseBayDto } from './dto/greenhouse-bay.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('greenhouse-bays')
@UseGuards(JwtAuthGuard)
export class GreenhouseBaysController {
  constructor(private readonly greenhouseBaysService: GreenhouseBaysService) {}

  @Get()
  list(
    @Request() req: { user: { nurseryId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('zone') zone?: string,
  ) {
    return this.greenhouseBaysService.list(req.user.nurseryId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      zone,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { nurseryId: string } }, @Param('id') id: string) {
    return this.greenhouseBaysService.get(req.user.nurseryId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { nurseryId: string } },
    @Body() dto: CreateGreenhouseBayDto,
  ) {
    return this.greenhouseBaysService.create(req.user.nurseryId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { nurseryId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateGreenhouseBayDto,
  ) {
    return this.greenhouseBaysService.update(req.user.nurseryId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { nurseryId: string } }, @Param('id') id: string) {
    return this.greenhouseBaysService.remove(req.user.nurseryId, id);
  }
}
