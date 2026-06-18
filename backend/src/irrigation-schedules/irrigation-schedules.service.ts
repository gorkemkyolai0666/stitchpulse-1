import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIrrigationScheduleDto, UpdateIrrigationScheduleDto } from './dto/irrigation-schedule.dto';

@Injectable()
export class IrrigationSchedulesService {
  constructor(private prisma: PrismaService) {}

  async list(nurseryId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { nurseryId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.irrigationSchedule.findMany({
        where,
        orderBy: { scheduledAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.irrigationSchedule.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(nurseryId: string, id: string) {
    const maintenance = await this.prisma.irrigationSchedule.findFirst({
      where: { id, nurseryId },
    });
    if (!maintenance) throw new NotFoundException('Kort bakım kaydı bulunamadı');
    return maintenance;
  }

  async create(nurseryId: string, dto: CreateIrrigationScheduleDto) {
    return this.prisma.irrigationSchedule.create({
      data: {
        ...dto,
        nurseryId,
        scheduledAt: new Date(dto.scheduledAt),
      },
    });
  }

  async update(nurseryId: string, id: string, dto: UpdateIrrigationScheduleDto) {
    await this.get(nurseryId, id);
    const data = { ...dto };
    if (dto.scheduledAt) {
      (data as { scheduledAt?: Date }).scheduledAt = new Date(dto.scheduledAt);
    }
    return this.prisma.irrigationSchedule.update({ where: { id }, data });
  }

  async remove(nurseryId: string, id: string) {
    await this.get(nurseryId, id);
    return this.prisma.irrigationSchedule.delete({ where: { id } });
  }
}
