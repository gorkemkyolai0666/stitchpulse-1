# StitchPulse — Deployment

**Son Güncelleme:** 2026-06-17  
**Durum:** Deploy bekliyor — altyapı kimlik bilgileri eksik

## Demo Hesabı

| Alan | Değer |
|------|-------|
| E-posta | demo@heritagetailors.com |
| Şifre | demo123456 |

## Ortam Değişkenleri

### Backend (Railway)

```
DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=
PORT=4017
```

### Frontend (Vercel)

```
NEXT_PUBLIC_API_URL=
```

## Deployment URL'leri

| Kaynak | URL | Durum |
|--------|-----|-------|
| Frontend (Vercel) | _Bekliyor_ | GitHub entegrasyonu gerekli |
| Backend (Railway) | _Bekliyor_ | GitHub entegrasyonu gerekli |
| Health | _Bekliyor_/api/health | Railway deploy sonrası |

## Eksik Altyapı Yetenekleri

| Secret/Yetki | Durum |
|--------------|-------|
| RAILWAY_API_TOKEN | ❌ Agent ortamında mevcut değil |
| VERCEL_TOKEN | ❌ Vercel MCP CLI öneriyor — GitHub entegrasyonu tercih edilmeli |
| Railway GitHub entegrasyonu | ❌ stitchpulse reposu için yapılandırılmamış |
| Vercel GitHub entegrasyonu | ❌ stitchpulse reposu için yapılandırılmamış |

## Provisioning

```bash
npm run provision
```

Provisioning scriptleri idempotent olarak Railway ve Vercel yapılandırma adımlarını yazdırır.

## Doğrulama Checklist (Deploy Sonrası)

- [ ] GET /api/health → HTTP 200
- [ ] Demo hesap girişi
- [ ] Kimlik doğrulamalı dashboard isteği
- [ ] Workstation CRUD smoke testleri
- [ ] Fabric order CRUD smoke testleri

## CI

GitHub Actions: `.github/workflows/ci.yml`  
Backend port: 4017, Postgres port: 5457
