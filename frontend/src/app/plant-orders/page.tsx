'use client';

import { useEffect, useState } from 'react';
import { Plus, Package } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatPlantOrderStatus, formatCurrency } from '@/lib/utils';

interface PlantOrderItem {
  id: string;
  buyerName: string;
  plantVariety: string;
  supplierName?: string;
  status: string;
  price: number;
}

interface ListResponse {
  data: PlantOrderItem[];
  total: number;
}

const STATUSES = ['pending', 'in_progress', 'completed', 'delivered'];

const emptyForm = {
  buyerName: '',
  plantVariety: '',
  supplierName: '',
  status: 'pending',
  price: '0',
};

export default function PlantOrdersPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<PlantOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.plantOrders
      .list(token)
      .then((res) => setItems((res as ListResponse).data))
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
      await api.plantOrders.create(token, {
        buyerName: form.buyerName,
        plantVariety: form.plantVariety,
        supplierName: form.supplierName || undefined,
        status: form.status,
        price: parseFloat(form.price),
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
            <h1 className="font-display text-3xl text-primary">Bitki Siparişi Siparişleri</h1>
            <p className="text-muted-foreground">Kilit, mekanizma ve dekor sipariş takibi</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="atelier-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Sipariş'}
          </Button>
        </div>

        {showForm && (
          <Card className="atelier-card">
            <CardHeader>
              <CardTitle className="font-display">Bitki Siparişi Siparişi Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="buyerName">Müşteri / Talep Eden</Label>
                  <Input id="buyerName" value={form.buyerName} onChange={(e) => update('buyerName', e.target.value)} required placeholder="Örn: Escape Props Co." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplierName">Tedarikçi</Label>
                  <Input id="supplierName" value={form.supplierName} onChange={(e) => update('supplierName', e.target.value)} placeholder="Örn: PuzzleCraft Supply" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="plantVariety">Bitki Siparişi Kategorisi</Label>
                  <Input id="plantVariety" value={form.plantVariety} onChange={(e) => update('plantVariety', e.target.value)} required placeholder="Örn: İpek Saten Set" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Tarife ($)</Label>
                  <Input id="price" type="number" min={0} step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <select id="status" value={form.status} onChange={(e) => update('status', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{formatPlantOrderStatus(s)}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={submitting} className="atelier-btn">
                    {submitting ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading && <LoadingSpinner />}
        {error && !loading && items.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && items.length === 0 && (
          <EmptyState title="Sipariş bulunamadı" description="Henüz prop siparişi eklenmemiş." />
        )}
        {!loading && items.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <Card key={item.id} className="atelier-card">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-semibold">{item.buyerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.plantVariety} · {item.supplierName || 'Tedarikçi belirtilmemiş'} · {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{formatPlantOrderStatus(item.status)}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
