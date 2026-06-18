import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateNurseryDto } from './dto/update-nursery.dto';

@Injectable()
export class NurseryService {
  constructor(private prisma: PrismaService) {}

  async get(nurseryId: string) {
    const nursery = await this.prisma.nursery.findUnique({
      where: { id: nurseryId },
    });
    if (!nursery) throw new NotFoundException('Tenis kulübü bulunamadı');
    return nursery;
  }

  async update(nurseryId: string, dto: UpdateNurseryDto) {
    await this.get(nurseryId);
    return this.prisma.nursery.update({ where: { id: nurseryId }, data: dto });
  }
}
