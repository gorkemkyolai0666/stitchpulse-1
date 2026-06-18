import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockPrisma = {
    nursery: { findUnique: jest.fn() },
    greenhouseBay: { count: jest.fn(), groupBy: jest.fn() },
    harvestBatch: {
      count: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
    equipmentRepair: { count: jest.fn(), findMany: jest.fn().mockResolvedValue([]) },
    irrigationSchedule: { count: jest.fn() },
    plantPricing: { count: jest.fn() },
    plantOrder: { count: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    jest.clearAllMocks();
  });

  it('should return nursery dashboard stats', async () => {
    mockPrisma.nursery.findUnique.mockResolvedValue({ totalBays: 8 });
    mockPrisma.greenhouseBay.count
      .mockResolvedValueOnce(8)
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(2);
    mockPrisma.harvestBatch.count.mockResolvedValue(42);
    mockPrisma.equipmentRepair.count
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(1);
    mockPrisma.harvestBatch.aggregate.mockResolvedValue({
      _sum: { cashSales: 120, cardSales: 280, rushPremium: 95 },
    });
    mockPrisma.harvestBatch.findMany.mockResolvedValue([]);
    mockPrisma.equipmentRepair.findMany.mockResolvedValue([]);
    mockPrisma.irrigationSchedule.count.mockResolvedValue(2);
    mockPrisma.plantPricing.count.mockResolvedValue(3);
    mockPrisma.plantOrder.count
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(2);
    mockPrisma.greenhouseBay.groupBy.mockResolvedValue([
      { zone: 'East Zone', _count: { id: 3 } },
      { zone: 'West Zone', _count: { id: 3 } },
    ]);

    const stats = await service.getStats('shop-1');

    expect(stats).toHaveProperty('greenhouseBayUtilizationRate');
    expect(stats).toHaveProperty('dailyRevenue', 495);
    expect(stats).toHaveProperty('dailyRushFees', 95);
    expect(stats).toHaveProperty('shopZones');
    expect(stats).toHaveProperty('urgentEquipmentRepair');
    expect(stats).toHaveProperty('pendingIrrigationSchedule');
    expect(stats).toHaveProperty('activePlantPricings', 3);
    expect(stats).toHaveProperty('pendingPlantOrders', 3);
    expect(stats).toHaveProperty('completedPlantOrders', 2);
    expect(stats).toHaveProperty('availableGreenhouseBays', 4);
    expect(stats).toHaveProperty('totalCapacity', 8);
  });
});
