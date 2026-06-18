import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(nurseryId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      nursery,
      totalBays,
      availableGreenhouseBays,
      inUseGreenhouseBays,
      totalJobs,
      openEquipmentRepair,
      urgentEquipmentRepair,
      pendingIrrigationSchedule,
      activePlantPricings,
      pendingPlantOrders,
      completedPlantOrders,
      revenueTotals,
      recentJobs,
      recentEquipmentRepair,
      shopZones,
    ] = await Promise.all([
      this.prisma.nursery.findUnique({ where: { id: nurseryId } }),
      this.prisma.greenhouseBay.count({ where: { nurseryId } }),
      this.prisma.greenhouseBay.count({ where: { nurseryId, status: 'active' } }),
      this.prisma.greenhouseBay.count({ where: { nurseryId, status: 'growing' } }),
      this.prisma.harvestBatch.count({ where: { nurseryId } }),
      this.prisma.equipmentRepair.count({
        where: { nurseryId, status: { in: ['open', 'in_progress'] } },
      }),
      this.prisma.equipmentRepair.count({
        where: {
          nurseryId,
          status: { in: ['open', 'in_progress'] },
          priority: { in: ['high', 'urgent'] },
        },
      }),
      this.prisma.irrigationSchedule.count({
        where: {
          nurseryId,
          status: { in: ['scheduled', 'overdue'] },
          scheduledAt: { lte: sevenDaysLater },
        },
      }),
      this.prisma.plantPricing.count({
        where: { nurseryId, status: 'active' },
      }),
      this.prisma.plantOrder.count({
        where: { nurseryId, status: { in: ['pending', 'in_progress'] } },
      }),
      this.prisma.plantOrder.count({
        where: { nurseryId, status: { in: ['completed', 'delivered'] } },
      }),
      this.prisma.harvestBatch.aggregate({
        where: { nurseryId, harvestedAt: { gte: today } },
        _sum: { cashSales: true, cardSales: true, rushPremium: true },
      }),
      this.prisma.harvestBatch.findMany({
        where: { nurseryId },
        include: {
          greenhouseBay: { select: { name: true, zone: true, climateType: true } },
        },
        orderBy: { harvestedAt: 'desc' },
        take: 5,
      }),
      this.prisma.equipmentRepair.findMany({
        where: { nurseryId, status: { in: ['open', 'in_progress'] } },
        include: {
          greenhouseBay: { select: { name: true, zone: true } },
        },
        orderBy: { reportedAt: 'desc' },
        take: 5,
      }),
      this.prisma.greenhouseBay.groupBy({
        by: ['zone'],
        where: { nurseryId },
        _count: { id: true },
      }),
    ]);

    const totalCapacity = nursery?.totalBays || totalBays || 1;
    const greenhouseBayUtilizationRate =
      totalBays > 0 ? Math.round((inUseGreenhouseBays / totalBays) * 1000) / 10 : 0;

    const dailyRevenue =
      (revenueTotals._sum.cashSales || 0) +
      (revenueTotals._sum.cardSales || 0) +
      (revenueTotals._sum.rushPremium || 0);

    const dailyRushFees = revenueTotals._sum.rushPremium || 0;

    const monthlyTrend = await this.getMonthlyTrend(nurseryId, sixMonthsAgo);

    return {
      totalBays,
      availableGreenhouseBays,
      inUseGreenhouseBays,
      totalCapacity,
      greenhouseBayUtilizationRate,
      totalJobs,
      openEquipmentRepair,
      urgentEquipmentRepair,
      pendingIrrigationSchedule,
      activePlantPricings,
      pendingPlantOrders,
      completedPlantOrders,
      dailyRevenue,
      dailyRushFees,
      recentJobs,
      recentEquipmentRepair,
      shopZones: shopZones.map((w) => ({
        zone: w.zone,
        greenhouseBayCount: w._count.id,
      })),
      monthlyTrend,
    };
  }

  private async getMonthlyTrend(nurseryId: string, since: Date) {
    const sessions = await this.prisma.harvestBatch.findMany({
      where: { nurseryId, harvestedAt: { gte: since } },
      select: {
        harvestedAt: true,
        cashSales: true,
        cardSales: true,
        rushPremium: true,
        unitCount: true,
      },
    });

    const months: Record<string, { games: number; revenue: number; unitCount: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { games: 0, revenue: 0, unitCount: 0 };
    }

    sessions.forEach((session) => {
      const key = `${session.harvestedAt.getFullYear()}-${String(session.harvestedAt.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) {
        months[key].games++;
        months[key].revenue +=
          session.cashSales + session.cardSales + session.rushPremium;
        months[key].unitCount += session.unitCount;
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data,
    }));
  }
}
