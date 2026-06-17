'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Scissors,
  ClipboardList,
  Wrench,
  CheckSquare,
  Package,
  Tags,
  Settings,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { href: '/workstations', label: 'İstasyonlar', icon: Scissors },
  { href: '/alteration-jobs', label: 'Tadilatlar', icon: ClipboardList },
  { href: '/equipment-maintenance', label: 'Ekipman', icon: Wrench },
  { href: '/quality-checklists', label: 'Kalite', icon: CheckSquare },
  { href: '/fabric-orders', label: 'Kumaş', icon: Package },
  { href: '/service-rates', label: 'Tarifeler', icon: Tags },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
];

export function TopNav() {
  const pathname = usePathname();
  const { tailoringShop, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2" aria-label="StitchPulse ana sayfa">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Scissors className="h-4 w-4" strokeWidth={2} />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-lg leading-none text-primary">StitchPulse</p>
            <p className="truncate text-[11px] text-muted-foreground">{tailoringShop?.name || 'Atölye'}</p>
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
                  'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors',
                  active
                    ? 'bg-accent text-accent-foreground shadow-sm'
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
            className="h-9 w-9 rounded-full"
            aria-label="Tema değiştir"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive"
            aria-label="Çıkış yap"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
