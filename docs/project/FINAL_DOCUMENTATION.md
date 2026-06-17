# StitchPulse — Final Documentation

**Proje:** StitchPulse  
**Repo:** https://github.com/gorkemkyolai06/stitchpulse  
**Tamamlanma:** 2026-06-17  
**Durum:** MVP tamamlandı, deployment bekliyor

## Ürün Özeti

Terzi ve tadilat atölyeleri için operasyon yönetim SaaS platformu. NestJS + Prisma + PostgreSQL backend, Next.js + Tailwind + shadcn/ui frontend.

## Modüller

| Modül | API Prefix | Açıklama |
|-------|-----------|----------|
| TailoringShop | /api/tailoring-shop | Atölye profili |
| Workstations | /api/workstations | İş istasyonu envanteri |
| AlterationJobs | /api/alteration-jobs | Tadilat işleri |
| EquipmentMaintenance | /api/equipment-maintenance | Ekipman bakımı |
| QualityChecklists | /api/quality-checklists | Kalite kontrol |
| FabricOrders | /api/fabric-orders | Kumaş siparişleri |
| ServiceRates | /api/service-rates | Hizmet tarifeleri |
| Dashboard | /api/dashboard/stats | Özet istatistikler |

## Demo

```
E-posta: demo@heritagetailors.com
Şifre: demo123456
```

## Kararlar

1. EscapePulse şablonundan domain dönüşümü (`scripts/transform-from-escapepulse.py`)
2. Premium Editorial Fashion tasarım yönü — üst navigasyon, terracotta paleti
3. Ayrı public GitHub reposu (fabrika deposu dışında)
4. Deployment: Railway backend + Vercel frontend via GitHub integration

## Eksikler

- Production URL'ler (RAILWAY_API_TOKEN ve platform entegrasyonları eksik)
- Factory memory'de kayıtlı
