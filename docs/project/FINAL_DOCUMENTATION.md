# GrowPulse — Final Documentation

**Tamamlanma**: 2026-06-18  
**Repo**: https://github.com/gorkemkyolai0666/stitchpulse-1

## Proje Özeti

| Boyut | Değer |
|-------|-------|
| **Proje** | GrowPulse |
| **Sektör** | Hortikültür / sera & fidanlık operasyonları |
| **Hedef Kitle** | ABD'deki 5-20 sera bölümlü bağımsız fidanlık operatörleri |
| **Problem** | Sulama planları, hasat kayıtları ve ekipman bakımı kağıt/Excel ile yönetiliyor |
| **İş Modeli** | B2B SaaS — sera başına $4-10/ay |
| **Tasarım** | Content-first Botanical Editorial |
| **Demo** | demo@evergreennursery.com / demo123456 |

## Teknik Stack

- Backend: NestJS + Prisma + PostgreSQL
- Frontend: Next.js 14 + Tailwind + shadcn-style UI
- CI: GitHub Actions (backend tests + integration + frontend build + provision)
- Deploy: Railway (backend) + Vercel (frontend)

## API Modülleri

| Modül | Endpoint | Açıklama |
|-------|----------|----------|
| Nursery | /api/nursery | Fidanlık profili |
| GreenhouseBays | /api/greenhouse-bays | Sera bölümleri |
| HarvestBatches | /api/harvest-batches | Hasat kayıtları |
| EquipmentRepairs | /api/equipment-repairs | Ekipman onarım |
| IrrigationSchedules | /api/irrigation-schedules | Sulama planları |
| PlantOrders | /api/plant-orders | Bitki siparişleri |
| PlantPricing | /api/plant-pricing | Fiyat listesi |

## Deployment Notları

Deployment, organization-level GitHub Actions secrets (`GH_PAT`, `RAILWAY_API_TOKEN`, `VERCEL_TOKEN`) yapılandırıldığında `npm run provision` ile otomatik tamamlanır.
