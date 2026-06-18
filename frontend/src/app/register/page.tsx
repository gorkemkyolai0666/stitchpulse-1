'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { KeyRound } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    nurseryName: '',
    phone: '',
    city: '',
    state: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      router.push('/dashboard');
    } catch {
      setError('Kayıt başarısız. E-posta zaten kullanılıyor olabilir.');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 py-8">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center border-t-2 border-accent bg-void text-candle shadow-sm">
          <KeyRound className="h-7 w-7 text-candle" strokeWidth={2} />
        </div>
        <h1 className="font-display text-3xl text-primary">Tesis Kaydı</h1>
      </div>

      <Card className="atelier-card w-full max-w-lg">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Yeni Bahçıvan Fidanlıksi Tesisi Oluştur</CardTitle>
          <CardDescription>14 gün ücretsiz deneme ile başlayın</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="border border-destructive bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                {error}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ad</Label>
                <Input id="firstName" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Soyad</Label>
                <Input id="lastName" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nurseryName">Tesis Adı</Label>
              <Input
                id="nurseryName"
                value={form.nurseryName}
                onChange={(e) => update('nurseryName', e.target.value)}
                required
                placeholder="Evergreen Nursery Co."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">Şehir</Label>
                <Input id="city" value={form.city} onChange={(e) => update('city', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">İl</Label>
                <Input id="state" value={form.state} onChange={(e) => update('state', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </div>
            </div>
            <Button type="submit" className="atelier-btn w-full" disabled={loading}>
              {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Zaten hesabınız var mı?{' '}
            <Link href="/login" className="font-bold text-accent hover:underline">
              Giriş yapın
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
