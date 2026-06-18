import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlantOrderDto, UpdatePlantOrderDto } from './dto/plant-order.dto';

@Injectable()
export class PlantOrdersService {
  constructor(private prisma: PrismaService) {}

  async list(
    nurseryId: string,
    params: { page?: number; status?: string; plantVariety?: string },
  ) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { nurseryId };
    if (params.status) where.status = params.status;
    if (params.plantVariety) where.plantVariety = params.plantVariety;

    const [data, total] = await Promise.all([
      this.prisma.plantOrder.findMany({
        where,
        orderBy: [{ status: 'asc' }, { buyerName: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.plantOrder.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async pending(nurseryId: string) {
    return this.prisma.plantOrder.findMany({
      where: { nurseryId, status: { in: ['pending', 'in_progress'] } },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });
  }

  async get(nurseryId: string, id: string) {
    const order = await this.prisma.plantOrder.findFirst({
      where: { id, nurseryId },
    });
    if (!order) throw new NotFoundException('Tel gerdirme siparişi bulunamadı');
    return order;
  }

  async create(nurseryId: string, dto: CreatePlantOrderDto) {
    return this.prisma.plantOrder.create({ data: { ...dto, nurseryId } });
  }

  async update(nurseryId: string, id: string, dto: UpdatePlantOrderDto) {
    await this.get(nurseryId, id);
    return this.prisma.plantOrder.update({ where: { id }, data: dto });
  }

  async remove(nurseryId: string, id: string) {
    await this.get(nurseryId, id);
    return this.prisma.plantOrder.delete({ where: { id } });
  }
}
