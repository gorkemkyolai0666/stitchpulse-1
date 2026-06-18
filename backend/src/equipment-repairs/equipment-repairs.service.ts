import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateEquipmentRepairDto,
  UpdateEquipmentRepairDto,
} from './dto/equipment-repair.dto';

@Injectable()
export class EquipmentRepairsService {
  constructor(private prisma: PrismaService) {}

  async list(
    nurseryId: string,
    params: { page?: number; status?: string; priority?: string },
  ) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { nurseryId };
    if (params.status) where.status = params.status;
    if (params.priority) where.priority = params.priority;

    const [data, total] = await Promise.all([
      this.prisma.equipmentRepair.findMany({
        where,
        orderBy: { reportedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          greenhouseBay: { select: { id: true, name: true, zone: true } },
        },
      }),
      this.prisma.equipmentRepair.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async urgent(nurseryId: string) {
    return this.prisma.equipmentRepair.findMany({
      where: {
        nurseryId,
        status: { in: ['open', 'in_progress'] },
        priority: { in: ['high', 'urgent'] },
      },
      include: { greenhouseBay: { select: { name: true, zone: true } } },
      orderBy: { reportedAt: 'desc' },
      take: 10,
    });
  }

  async get(nurseryId: string, id: string) {
    const maintenance = await this.prisma.equipmentRepair.findFirst({
      where: { id, nurseryId },
      include: { greenhouseBay: true },
    });
    if (!maintenance) throw new NotFoundException('Top makinesi bakım kaydı bulunamadı');
    return maintenance;
  }

  async create(nurseryId: string, dto: CreateEquipmentRepairDto) {
    return this.prisma.equipmentRepair.create({
      data: {
        ...dto,
        nurseryId,
        reportedAt: dto.reportedAt ? new Date(dto.reportedAt) : new Date(),
      },
      include: { greenhouseBay: true },
    });
  }

  async update(nurseryId: string, id: string, dto: UpdateEquipmentRepairDto) {
    await this.get(nurseryId, id);
    const data = { ...dto };
    if (dto.reportedAt) {
      (data as { reportedAt?: Date }).reportedAt = new Date(dto.reportedAt);
    }
    if (dto.completedAt) {
      (data as { completedAt?: Date }).completedAt = new Date(dto.completedAt);
    }
    return this.prisma.equipmentRepair.update({
      where: { id },
      data,
      include: { greenhouseBay: true },
    });
  }

  async remove(nurseryId: string, id: string) {
    await this.get(nurseryId, id);
    return this.prisma.equipmentRepair.delete({ where: { id } });
  }
}
