# StitchPulse — Tasarım Sistemi

**Yön:** Premium Editorial Fashion  
**Farklılaşma:** Üst yatay navigasyon, terracotta-krem-sage paleti, yuvarlak köşeler

## Tipografi

| Rol | Font |
|-----|------|
| Display | Playfair Display |
| Body/UI | DM Sans |
| Mono | system monospace |

## Renk Paleti

| Token | Açıklama | Light | Dark |
|-------|----------|-------|------|
| `--accent` | Terracotta CTA | hsl(14 52% 52%) | hsl(14 48% 58%) |
| `--background` | Krem zemin | hsl(35 30% 97%) | hsl(20 16% 9%) |
| `--secondary` | Sage vurgu | hsl(140 12% 88%) | hsl(140 10% 18%) |
| `--primary` | Kömür metin | hsl(20 18% 16%) | hsl(35 25% 94%) |

## Bileşen Dili

- `.atelier-card` — yuvarlak köşeli (16px), hafif gölge, sol kenar vurgusu yok
- `.atelier-btn` — pill şekilli CTA
- `.station-pill-*` — istasyon durum rozetleri

## Navigasyon

Üst sabit yatay sekme çubuğu (sol sidebar kullanılmaz). Mobilde ikon + kaydırılabilir sekmeler.

## Erişilebilirlik

WCAG AA kontrast, klavye navigasyonu, aria-label'lar, light/dark mod desteği.
