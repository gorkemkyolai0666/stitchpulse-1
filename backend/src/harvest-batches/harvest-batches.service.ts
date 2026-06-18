import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHarvestBatchDto, UpdateHarvestBatchDto } from './dto/harvest-batch.dto';

@Injectable()
export class HarvestBatchesService {
  constructor(private prisma: PrismaService) {}

  async list(nurseryId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { nurseryId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.harvestBatch.findMany({
        where,
        orderBy: { harvestedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          greenhouseBay: { select: { id: true, name: true, zone: true, climateType: true } },
        },
      }),
      this.prisma.harvestBatch.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(nurseryId: string, id: string) {
    const session = await this.prisma.harvestBatch.findFirst({
      where: { id, nurseryId },
      include: { greenhouseBay: true },
    });
    if (!session) throw new NotFoundException('Ders oturumu bulunamadı');
    return session;
  }

  async create(nurseryId: string, dto: CreateHarvestBatchDto) {
    return this.prisma.harvestBatch.create({
      data: {
        ...dto,
        nurseryId,
        harvestedAt: dto.harvestedAt ? new Date(dto.harvestedAt) : new Date(),
      },
      include: { greenhouseBay: true },
    });
  }

  async update(nurseryId: string, id: string, dto: UpdateHarvestBatchDto) {
    await this.get(nurseryId, id);
    const data = { ...dto };
    if (dto.harvestedAt) {
      (data as { harvestedAt?: Date }).harvestedAt = new Date(dto.harvestedAt);
    }
    return this.prisma.harvestBatch.update({
      where: { id },
      data,
      include: { greenhouseBay: true },
    });
  }

  async remove(nurseryId: string, id: string) {
    await this.get(nurseryId, id);
    return this.prisma.harvestBatch.delete({ where: { id } });
  }
}
