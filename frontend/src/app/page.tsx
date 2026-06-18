import Link from 'next/link';
import { Scissors, ClipboardList, Wrench, CheckSquare, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Scissors,
    title: 'İş İstasyonu Envanteri',
    description: 'Resmi giyim, gelinlik, deri ve özel iş istasyonlarınızı bölge bazında takip edin.',
  },
  {
    icon: ClipboardList,
    title: 'Hasat İşleri',
    description: 'Günlük gelir, parça sayısı ve acil iş ücretlerini tek panelden izleyin.',
  },
  {
    icon: Wrench,
    title: 'Ekipman Bakımı',
    description: 'Dikiş makinesi, pres ve prova odası arızalarını öncelik sırasıyla yönetin.',
  },
  {
    icon: CheckSquare,
    title: 'Sulama Kontrol Listeleri',
    description: 'Son pres, dikiş kontrolü ve prova hazırlığı planlarını takip edin.',
  },
  {
    icon: Package,
    title: 'Bitki Siparişi Siparişleri',
    description: 'Müşteri kumaş siparişlerini tedarikçi ve durum bazında yönetin.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/80 bg-card atelier-nav-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Scissors className="h-5 w-5" strokeWidth={2} />
            </div>
            <span className="font-display text-2xl text-primary">GrowPulse</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Giriş Yap</Link>
            </Button>
            <Button asChild className="atelier-btn bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/register">Ücretsiz Başla</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-secondary/40 via-background to-accent/5">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, hsl(var(--accent)) 0, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--success)) 0, transparent 40%)',
            }}
          />
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Bahçıvan & Hasat Fidanlıksi Operasyon Yönetimi
            </p>
            <h1 className="font-display max-w-2xl text-4xl leading-tight text-primary md:text-5xl">
              Fidanlıknizi, tadilat işlerinizi ve müşteri teslimatlarınızı tek platformda yönetin
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Bağımsız terzi ve tadilat atölyeleri için iş istasyonu envanteri, tadilat takibi,
              ekipman bakımı, kalite kontrol listeleri, kumaş siparişleri ve hizmet tarifesi yönetimi.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="atelier-btn">
                <Link href="/register">
                  Hemen Başla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href="/login">Demo Hesabıyla Giriş</Link>
              </Button>
            </div>
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              Demo: demo@evergreennursery.com / demo123456
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display mb-8 text-2xl text-primary">Özellikler</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="atelier-card p-6">
                  <Icon className="mb-4 h-6 w-6 text-accent" strokeWidth={1.5} />
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
