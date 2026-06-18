'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sprout,
  PackageSearch,
  Wrench,
  Droplets,
  ShoppingBasket,
  Tags,
  Settings,
  Sun,
  Moon,
  LogOut,
  Leaf,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { href: '/greenhouse-bays', label: 'Seralar', icon: Sprout },
  { href: '/harvest-batches', label: 'Hasatlar', icon: PackageSearch },
  { href: '/equipment-repairs', label: 'Ekipman', icon: Wrench },
  { href: '/irrigation-schedules', label: 'Sulama', icon: Droplets },
  { href: '/plant-orders', label: 'Siparişler', icon: ShoppingBasket },
  { href: '/plant-pricing', label: 'Fiyatlar', icon: Tags },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
];

export function TopNav() {
  const pathname = usePathname();
  const { nursery, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2" aria-label="GrowPulse ana sayfa">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf-soft text-leaf">
            <Leaf className="h-4 w-4" strokeWidth={2.25} />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-lg leading-none text-primary">GrowPulse</p>
            <p className="truncate text-[11px] text-muted-foreground">{nursery?.name || 'Fidanlık'}</p>
          </div>
        </Link>

        <nav
          className="flex flex-1 items-center gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Ana menü"
        >
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="h-4 w-4" strokeWidth={active ? 2.25 : 1.75} />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          {user && (
            <span className="mr-1 hidden text-xs text-muted-foreground lg:inline">
              {user.firstName} {user.lastName}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-lg"
            aria-label="Tema değiştir"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-9 w-9 rounded-lg text-muted-foreground hover:text-destructive"
            aria-label="Çıkış yap"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
