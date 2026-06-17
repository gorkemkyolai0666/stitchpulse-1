'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { LoadingSpinner, ErrorState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

interface TailoringShopProfile {
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  totalWorkstations: number;
  timezone: string;
}

export default function SettingsPage() {
  const { token } = useAuth();
  const [venue, setVenue] = useState<TailoringShopProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.tailoringShop
      .get(token)
      .then((data) => setVenue(data as TailoringShopProfile))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !venue) return;
    setSaving(true);
    setSuccess(false);
    try {
      await api.tailoringShop.update(token, venue as unknown as Record<string, unknown>);
      setSuccess(true);
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="font-display text-3xl text-primary">Ayarlar</h1>
          <p className="text-muted-foreground">Terzi atölyesi tesisi profil bilgileri</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && !venue && <ErrorState onRetry={load} />}
        {venue && !loading && (
          <Card className="atelier-card">
            <CardHeader>
              <CardTitle className="font-display">Tesis Profili</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                {success && (
                  <div className="border border-success bg-success/10 p-3 text-sm text-success" role="status">
                    Ayarlar kaydedildi.
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Tesis Adı</Label>
                  <Input
                    id="name"
                    value={venue.name}
                    onChange={(e) => setVenue({ ...venue, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={venue.phone || ''}
                    onChange={(e) => setVenue({ ...venue, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Input
                    id="address"
                    value={venue.address || ''}
                    onChange={(e) => setVenue({ ...venue, address: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">Şehir</Label>
                    <Input
                      id="city"
                      value={venue.city || ''}
                      onChange={(e) => setVenue({ ...venue, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">İl</Label>
                    <Input
                      id="state"
                      value={venue.state || ''}
                      onChange={(e) => setVenue({ ...venue, state: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Posta Kodu</Label>
                    <Input
                      id="zipCode"
                      value={venue.zipCode || ''}
                      onChange={(e) => setVenue({ ...venue, zipCode: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalWorkstations">Toplam Oda Sayısı</Label>
                  <Input
                    id="totalWorkstations"
                    type="number"
                    value={venue.totalWorkstations}
                    onChange={(e) =>
                      setVenue({ ...venue, totalWorkstations: parseInt(e.target.value, 10) || 0 })
                    }
                  />
                </div>
                <Button type="submit" disabled={saving} className="atelier-btn">
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
