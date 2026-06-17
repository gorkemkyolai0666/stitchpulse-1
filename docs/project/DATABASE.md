# StitchPulse — Veritabanı (DATABASE)

## PostgreSQL

Connection: `DATABASE_URL` environment variable

## Modeller

| Model | Tablo | Açıklama |
|-------|-------|----------|
| TailoringShop | tailoring_shops | Tenis tesisi profili |
| User | users | Kullanıcı hesapları |
| Court | courts | Kort envanteri |
| AlterationJob | alteration_jobs | Ders gelir kayıtları |
| EquipmentMaintenance | equipment_maintenance | Top makinesi bakım |
| QualityChecklist | quality_checklists | Kort bakım planı |
| FabricOrder | fabric_orders | Kordon siparişleri |
| ServiceRate | service_rates | Tarife kademeleri |

## Migration

```bash
npm run db:migrate   # prisma migrate deploy
npm run db:seed      # prisma db seed
npm run deploy       # migrate + seed + start:prod
```

## Seed Verisi

- 1 tesis: Heritage Tailors & Alterations (Phoenix, AZ)
- 1 demo kullanıcı: demo@heritagetailors.com
- 8 kort (kil, sert, çim, kapalı)
- 2 ders oturumu
- 2 top makinesi bakım kaydı
- 2 kort bakım planı
- 3 fiyat kademesi
- 5 kordon siparişi

Seed idempotent — upsert ile tekrar çalıştırılabilir.
