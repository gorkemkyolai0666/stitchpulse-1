import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGreenhouseBayDto, UpdateGreenhouseBayDto } from './dto/greenhouse-bay.dto';

@Injectable()
export class GreenhouseBaysService {
  constructor(private prisma: PrismaService) {}

  async list(nurseryId: string, params: { page?: number; status?: string; zone?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { nurseryId };
    if (params.status) where.status = params.status;
    if (params.zone) where.zone = params.zone;

    const [data, total] = await Promise.all([
      this.prisma.greenhouseBay.findMany({
        where,
        orderBy: [{ zone: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          equipmentRepairs: {
            where: { status: { in: ['open', 'in_progress'] } },
            take: 1,
            orderBy: { reportedAt: 'desc' },
          },
        },
      }),
      this.prisma.greenhouseBay.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(nurseryId: string, id: string) {
    const court = await this.prisma.greenhouseBay.findFirst({
      where: { id, nurseryId },
      include: {
        equipmentRepairs: { orderBy: { reportedAt: 'desc' }, take: 5 },
        harvestBatches: { orderBy: { harvestedAt: 'desc' }, take: 5 },
      },
    });
    if (!court) throw new NotFoundException('İstasyon bulunamadı');
    return court;
  }

  async create(nurseryId: string, dto: CreateGreenhouseBayDto) {
    return this.prisma.greenhouseBay.create({ data: { ...dto, nurseryId } });
  }

  async update(nurseryId: string, id: string, dto: UpdateGreenhouseBayDto) {
    await this.get(nurseryId, id);
    return this.prisma.greenhouseBay.update({ where: { id }, data: dto });
  }

  async remove(nurseryId: string, id: string) {
    await this.get(nurseryId, id);
    return this.prisma.greenhouseBay.delete({ where: { id } });
  }
}
