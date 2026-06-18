# GrowPulse — Veritabanı (DATABASE)

## PostgreSQL

Connection: `DATABASE_URL` environment variable

## Modeller

| Model | Tablo | Açıklama |
|-------|-------|----------|
| Nursery | tailoring_shops | Tenis tesisi profili |
| User | users | Kullanıcı hesapları |
| Court | courts | Kort envanteri |
| HarvestBatch | harvest_batches | Ders gelir kayıtları |
| EquipmentRepair | equipment_repairs | Top makinesi bakım |
| IrrigationSchedule | irrigation_schedules | Kort bakım planı |
| PlantOrder | plant_orders | Kordon siparişleri |
| PlantPricing | plant_pricing | Tarife kademeleri |

## Migration

```bash
npm run db:migrate   # prisma migrate deploy
npm run db:seed      # prisma db seed
npm run deploy       # migrate + seed + start:prod
```

## Seed Verisi

- 1 tesis: Evergreen Nursery Co. (Phoenix, AZ)
- 1 demo kullanıcı: demo@evergreennursery.com
- 8 kort (kil, sert, çim, kapalı)
- 2 ders oturumu
- 2 top makinesi bakım kaydı
- 2 kort bakım planı
- 3 fiyat kademesi
- 5 kordon siparişi

Seed idempotent — upsert ile tekrar çalıştırılabilir.
