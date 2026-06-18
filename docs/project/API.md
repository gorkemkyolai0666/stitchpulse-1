# GrowPulse — API (API)

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
| GET | /api/harvest-batches | Yes | 200 |
| GET | /api/harvest-batches/:id | Yes | 200 |
| POST | /api/harvest-batches | Yes | 201 |
| PATCH | /api/harvest-batches/:id | Yes | 200 |
| DELETE | /api/harvest-batches/:id | Yes | 200 |

## Ball Machine Maintenance

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/equipment-repairs | Yes | 200 |
| GET | /api/equipment-repairs/urgent | Yes | 200 |
| GET | /api/equipment-repairs/:id | Yes | 200 |
| POST | /api/equipment-repairs | Yes | 201 |
| PATCH | /api/equipment-repairs/:id | Yes | 200 |
| DELETE | /api/equipment-repairs/:id | Yes | 200 |

## Court Maintenance

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/irrigation-schedules | Yes | 200 |
| GET | /api/irrigation-schedules/:id | Yes | 200 |
| POST | /api/irrigation-schedules | Yes | 201 |
| PATCH | /api/irrigation-schedules/:id | Yes | 200 |
| DELETE | /api/irrigation-schedules/:id | Yes | 200 |

## Stringing Orders

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/plant-orders | Yes | 200 |
| GET | /api/plant-orders/pending | Yes | 200 |
| GET | /api/plant-orders/:id | Yes | 200 |
| POST | /api/plant-orders | Yes | 201 |
| PATCH | /api/plant-orders/:id | Yes | 200 |
| DELETE | /api/plant-orders/:id | Yes | 200 |

## Rate Tiers

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/plant-pricing | Yes | 200 |
| GET | /api/plant-pricing/:id | Yes | 200 |
| POST | /api/plant-pricing | Yes | 201 |
| PATCH | /api/plant-pricing/:id | Yes | 200 |
| DELETE | /api/plant-pricing/:id | Yes | 200 |

## Dashboard

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | /api/dashboard/stats | Yes | 200 |
