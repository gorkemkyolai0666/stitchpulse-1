# StitchPulse — API (API)

Base URL: `{NEXT_PUBLIC_API_URL}` (production: Railway backend URL + `/api`)

## Auth

| Method | Endpoint | Auth | Status | Açıklama |
|--------|----------|------|--------|----------|
| POST | /api/auth/login | No | 200 | Giriş |
| POST | /api/auth/register | No | 201 | Kayıt |

## Health

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/health | No | 200 |

## Tennis Club

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/tennis-club | Yes | 200 |
| PATCH | /api/tennis-club | Yes | 200 |

## Courts

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/courts | Yes | 200 |
| GET | /api/courts/:id | Yes | 200 |
| POST | /api/courts | Yes | 201 |
| PATCH | /api/courts/:id | Yes | 200 |
| DELETE | /api/courts/:id | Yes | 200 |

## Lesson Sessions

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/alteration-jobs | Yes | 200 |
| GET | /api/alteration-jobs/:id | Yes | 200 |
| POST | /api/alteration-jobs | Yes | 201 |
| PATCH | /api/alteration-jobs/:id | Yes | 200 |
| DELETE | /api/alteration-jobs/:id | Yes | 200 |

## Ball Machine Maintenance

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/equipment-maintenance | Yes | 200 |
| GET | /api/equipment-maintenance/urgent | Yes | 200 |
| GET | /api/equipment-maintenance/:id | Yes | 200 |
| POST | /api/equipment-maintenance | Yes | 201 |
| PATCH | /api/equipment-maintenance/:id | Yes | 200 |
| DELETE | /api/equipment-maintenance/:id | Yes | 200 |

## Court Maintenance

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/quality-checklists | Yes | 200 |
| GET | /api/quality-checklists/:id | Yes | 200 |
| POST | /api/quality-checklists | Yes | 201 |
| PATCH | /api/quality-checklists/:id | Yes | 200 |
| DELETE | /api/quality-checklists/:id | Yes | 200 |

## Stringing Orders

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/fabric-orders | Yes | 200 |
| GET | /api/fabric-orders/pending | Yes | 200 |
| GET | /api/fabric-orders/:id | Yes | 200 |
| POST | /api/fabric-orders | Yes | 201 |
| PATCH | /api/fabric-orders/:id | Yes | 200 |
| DELETE | /api/fabric-orders/:id | Yes | 200 |

## Rate Tiers

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/service-rates | Yes | 200 |
| GET | /api/service-rates/:id | Yes | 200 |
| POST | /api/service-rates | Yes | 201 |
| PATCH | /api/service-rates/:id | Yes | 200 |
| DELETE | /api/service-rates/:id | Yes | 200 |

## Dashboard

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/dashboard/stats | Yes | 200 |
