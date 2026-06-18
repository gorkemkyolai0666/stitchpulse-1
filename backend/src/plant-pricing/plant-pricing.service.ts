import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlantPricingDto, UpdatePlantPricingDto } from './dto/rate-tier.dto';

@Injectable()
export class PlantPricingService {
  constructor(private prisma: PrismaService) {}

  async list(nurseryId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { nurseryId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.plantPricing.findMany({
        where,
        orderBy: { plantCategory: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.plantPricing.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(nurseryId: string, id: string) {
    const tier = await this.prisma.plantPricing.findFirst({
      where: { id, nurseryId },
    });
    if (!tier) throw new NotFoundException('Tarife bulunamadı');
    return tier;
  }

  async create(nurseryId: string, dto: CreatePlantPricingDto) {
    return this.prisma.plantPricing.create({ data: { ...dto, nurseryId } });
  }

  async update(nurseryId: string, id: string, dto: UpdatePlantPricingDto) {
    await this.get(nurseryId, id);
    return this.prisma.plantPricing.update({ where: { id }, data: dto });
  }

  async remove(nurseryId: string, id: string) {
    await this.get(nurseryId, id);
    return this.prisma.plantPricing.delete({ where: { id } });
  }
}
