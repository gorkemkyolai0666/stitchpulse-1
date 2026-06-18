import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const NURSERY_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.nursery.upsert({
    where: { id: NURSERY_ID },
    update: {},
    create: {
      id: NURSERY_ID,
      name: 'Evergreen Nursery Co.',
      phone: '+15035550142',
      address: '2847 SE Powell Blvd',
      city: 'Portland',
      state: 'OR',
      zipCode: '97202',
      totalBays: 8,
      timezone: 'America/Los_Angeles',
      users: {
        create: {
          email: 'demo@evergreennursery.com',
          passwordHash,
          firstName: 'Aylin',
          lastName: 'Demir',
          role: 'owner',
        },
      },
    },
  });

  const bayData = [
    {
      id: '00000000-0000-0000-0000-000000000101',
      name: 'Bay A — Tropical House',
      zone: 'North Wing',
      climateType: 'tropical' as const,
      irrigationSystem: 'MistPro 4000',
      status: 'active' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000102',
      name: 'Bay B — Perennial Stock',
      zone: 'North Wing',
      climateType: 'temperate' as const,
      irrigationSystem: 'Netafim DripLine',
      status: 'growing' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000103',
      name: 'Bay C — Propagation',
      zone: 'Propagation House',
      climateType: 'propagation' as const,
      irrigationSystem: 'FogMaster 200',
      status: 'active' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000104',
      name: 'Bay D — Succulent Arid',
      zone: 'South Wing',
      climateType: 'arid' as const,
      irrigationSystem: 'Precision Drip 120',
      status: 'sanitizing' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000105',
      name: 'Bay E — Shade Perennials',
      zone: 'Shade Structure',
      climateType: 'shade' as const,
      irrigationSystem: 'RainBird Spray',
      status: 'maintenance' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000106',
      name: 'Bay F — Seasonal Display',
      zone: 'Retail Greenhouse',
      climateType: 'specialty' as const,
      irrigationSystem: 'Manual Hose Stations',
      status: 'closed' as const,
    },
  ];

  const bays = [];
  for (const bay of bayData) {
    const created = await prisma.greenhouseBay.upsert({
      where: { id: bay.id },
      update: {},
      create: { ...bay, nurseryId: NURSERY_ID },
    });
    bays.push(created);
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.harvestBatch.upsert({
    where: { id: '00000000-0000-0000-0000-000000000201' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000201',
      nurseryId: NURSERY_ID,
      greenhouseBayId: bays[1].id,
      harvestedAt: yesterday,
      harvestType: 'seedlings',
      cashSales: 0,
      cardSales: 485.0,
      unitCount: 120,
      rushPremium: 0,
      status: 'verified',
      notes: 'Tomato ve biber fidesi toptan satış',
    },
  });

  await prisma.harvestBatch.upsert({
    where: { id: '00000000-0000-0000-0000-000000000202' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000202',
      nurseryId: NURSERY_ID,
      greenhouseBayId: bays[2].id,
      harvestedAt: yesterday,
      harvestType: 'cuttings',
      cashSales: 125.0,
      cardSales: 210.0,
      unitCount: 48,
      rushPremium: 35.0,
      status: 'recorded',
      notes: 'Lavanta çelikleri perakende',
    },
  });

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  await prisma.equipmentRepair.upsert({
    where: { id: '00000000-0000-0000-0000-000000000301' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000301',
      nurseryId: NURSERY_ID,
      greenhouseBayId: bays[4].id,
      title: 'Isıtma fanı arızası — Bay E',
      description: 'Termostat sensörü tutarsız okuma veriyor',
      reportedAt: twoDaysAgo,
      priority: 'urgent',
      status: 'open',
      cost: 420,
    },
  });

  await prisma.equipmentRepair.upsert({
    where: { id: '00000000-0000-0000-0000-000000000302' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000302',
      nurseryId: NURSERY_ID,
      greenhouseBayId: bays[3].id,
      title: 'Drip hat tıkanması — Bay D',
      reportedAt: twoDaysAgo,
      priority: 'medium',
      status: 'in_progress',
    },
  });

  const inFiveDays = new Date();
  inFiveDays.setDate(inFiveDays.getDate() + 5);

  await prisma.irrigationSchedule.upsert({
    where: { id: '00000000-0000-0000-0000-000000000401' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000401',
      nurseryId: NURSERY_ID,
      title: 'Gübre uygulaması — Kuzey Kanat',
      category: 'fertilizer',
      zone: 'North Wing',
      scheduledAt: inFiveDays,
      status: 'scheduled',
    },
  });

  await prisma.irrigationSchedule.upsert({
    where: { id: '00000000-0000-0000-0000-000000000402' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000402',
      nurseryId: NURSERY_ID,
      title: 'Zararlı tarama — Propagation House',
      category: 'pest_scouting',
      zone: 'Propagation House',
      scheduledAt: inFiveDays,
      status: 'scheduled',
    },
  });

  const pricingData = [
    {
      id: '00000000-0000-0000-0000-000000000501',
      title: 'Yıllık Tepsi (36 hücre)',
      plantCategory: 'annual_tray' as const,
      basePrice: 4.5,
      status: 'active' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000502',
      title: 'Çok Yıllık Saksı (1 gal)',
      plantCategory: 'perennial_pot' as const,
      basePrice: 12.75,
      status: 'active' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000503',
      title: 'Ot Flat (24 adet)',
      plantCategory: 'herb_flat' as const,
      basePrice: 18.0,
      status: 'active' as const,
    },
    {
      id: '00000000-0000-0000-0000-000000000504',
      title: 'Toptan Fide (100+ adet)',
      plantCategory: 'bulk_wholesale' as const,
      basePrice: 2.25,
      status: 'active' as const,
    },
  ];

  for (const pricing of pricingData) {
    await prisma.plantPricing.upsert({
      where: { id: pricing.id },
      update: {},
      create: { ...pricing, nurseryId: NURSERY_ID },
    });
  }

  await prisma.plantOrder.upsert({
    where: { id: '00000000-0000-0000-0000-000000000601' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000601',
      nurseryId: NURSERY_ID,
      buyerName: 'Rose City Landscapes',
      plantVariety: 'Native Oregon Mix',
      supplierName: 'Pacific Plug & Liner',
      status: 'pending',
      price: 1250,
    },
  });

  console.log('GrowPulse seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
