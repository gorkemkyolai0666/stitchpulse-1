# GrowPulse Deployment

**Son Güncelleme**: 2026-06-18  
**Repo**: https://github.com/gorkemkyolai0666/stitchpulse-1 (rename to growpulse pending)

## Demo Hesap

| Alan | Değer |
|------|-------|
| E-posta | demo@evergreennursery.com |
| Şifre | demo123456 |

## Deployment Durumu

| Bileşen | Durum |
|---------|-------|
| GitHub Repo | ✅ MVP pushed |
| CI (backend + frontend) | ⏳ Bekleniyor |
| Railway Backend | ⏳ `npm run provision` — org secrets gerekli |
| Vercel Frontend | ⏳ GitHub entegrasyonu gerekli |
| Public Demo URL | ⏳ Deploy sonrası |

## Ortam Değişkenleri

### Backend (Railway, root: `backend/`)

```
DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=
PORT=4018
```

### Frontend (Vercel, root: `frontend/`)

```
NEXT_PUBLIC_API_URL=
```

## Health Endpoint

```
GET {BACKEND_URL}/api/health
```

## Provisioning

```bash
npm run provision
```

Organization secrets gerekli: `GH_PAT`, `RAILWAY_API_TOKEN`, `VERCEL_TOKEN`

## Smoke Test Checklist

- [ ] GET /api/health → 200
- [ ] Demo login → 200
- [ ] GET /api/dashboard/stats (auth) → 200
- [ ] CRUD greenhouse-bays
- [ ] CRUD plant-orders
- [ ] Frontend production URL → 200

## Public URLs

| Servis | URL |
|--------|-----|
| Frontend | TBD |
| Backend | TBD |
| Health | TBD |
