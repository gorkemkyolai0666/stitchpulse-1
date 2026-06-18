'use client';

import { useEffect, useState } from 'react';
import { Plus, Tags } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  formatCurrency,
  formatPlantPricingStatus,
  formatPlantCategory,
} from '@/lib/utils';

interface PlantPricing {
  id: string;
  title: string;
  plantCategory: string;
  basePrice: number;
  priceMultiplier: number;
  status: string;
}

interface ListResponse {
  data: PlantPricing[];
  total: number;
}

const CATEGORIES = [
  'room_booking',
  'corporate_event',
  'birthday_package',
  'team_building',
  'peak_hour',
  'other',
];
const STATUSES = ['active', 'upcoming', 'archived'];

const emptyForm = {
  title: '',
  plantCategory: 'room_booking',
  basePrice: '32.00',
  priceMultiplier: '1.0',
  status: 'active',
};

export default function PlantPricingsPage() {
  const { token } = useAuth();
  const [tiers, setTiers] = useState<PlantPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.plantPricing
      .list(token)
      .then((res) => setTiers((res as ListResponse).data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      await api.plantPricing.create(token, {
        title: form.title,
        plantCategory: form.plantCategory,
        basePrice: parseFloat(form.basePrice),
        priceMultiplier: parseFloat(form.priceMultiplier),
        status: form.status,
      });
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-primary">Hizmet Fiyat Listesii</h1>
            <p className="text-muted-foreground">Oda kiralama, etkinlik paketi ve yoğun saat fiyatları</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="atelier-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Kademe'}
          </Button>
        </div>

        {showForm && (
          <Card className="atelier-card">
            <CardHeader>
              <CardTitle className="font-display">Tarife Kademesi Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Başlık</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => update('title', e.target.value)}
                    required
                    placeholder="Örn: Standart Oda Kiralama"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plantCategory">Kategori</Label>
                  <select
                    id="plantCategory"
                    value={form.plantCategory}
                    onChange={(e) => update('plantCategory', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{formatPlantCategory(c)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Temel Tarife ($)</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.basePrice}
                    onChange={(e) => update('basePrice', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceMultiplier">Tarife Çarpanı</Label>
                  <Input
                    id="priceMultiplier"
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.priceMultiplier}
                    onChange={(e) => update('priceMultiplier', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="status">Durum</Label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => update('status', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm sm:max-w-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{formatPlantPricingStatus(s)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end sm:col-span-2">
                  <Button type="submit" disabled={submitting} className="atelier-btn">
                    {submitting ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading && <LoadingSpinner />}
        {error && !loading && tiers.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && tiers.length === 0 && (
          <EmptyState
            title="Tarife kademesi bulunamadı"
            description="Henüz fiyat kademesi yok."
            action={
              <Button onClick={() => setShowForm(true)} className="atelier-btn">
                <Plus className="mr-2 h-4 w-4" />
                Kademe Ekle
              </Button>
            }
          />
        )}
        {!loading && tiers.length > 0 && (
          <Card className="atelier-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 text-left font-mono text-xs uppercase">
                      <th className="p-3" scope="col">Başlık</th>
                      <th className="p-3" scope="col">Kategori</th>
                      <th className="p-3" scope="col">Temel Tarife</th>
                      <th className="p-3" scope="col">Çarpan</th>
                      <th className="p-3" scope="col">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiers.map((tier) => (
                      <tr key={tier.id} className="border-b border-muted hover:bg-muted/30">
                        <td className="p-3 font-medium">
                          <span className="flex items-center gap-2">
                            <Tags className="h-4 w-4 text-accent" />
                            {tier.title}
                          </span>
                        </td>
                        <td className="p-3">{formatPlantCategory(tier.plantCategory)}</td>
                        <td className="p-3 font-mono font-bold">{formatCurrency(tier.basePrice)}</td>
                        <td className="p-3 font-mono">{tier.priceMultiplier}x</td>
                        <td className="p-3">
                          <Badge variant="secondary">{formatPlantPricingStatus(tier.status)}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
