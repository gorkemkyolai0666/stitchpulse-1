'use client';

import { useEffect, useState } from 'react';
import { Plus, ClipboardCheck } from 'lucide-react';
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
  formatDateTime,
  formatQualityChecklistStatus,
  formatQualityChecklistCategory,
} from '@/lib/utils';

interface QualityChecklistItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  zone?: string;
  scheduledAt: string;
  status: string;
}

interface ListResponse {
  data: QualityChecklistItem[];
  total: number;
}

const CATEGORIES = ['full_reset', 'prop_check', 'clue_refresh', 'lock_repair', 'lighting', 'other'];
const STATUSES = ['scheduled', 'in_progress', 'completed', 'overdue'];

const emptyForm = {
  title: '',
  description: '',
  category: 'full_reset',
  zone: '',
  scheduledAt: new Date().toISOString().slice(0, 16),
  status: 'scheduled',
};

export default function QualityChecklistPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<QualityChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.qualityChecklist
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
      await api.qualityChecklist.create(token, {
        title: form.title,
        description: form.description || undefined,
        category: form.category,
        zone: form.zone || undefined,
        scheduledAt: form.scheduledAt,
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
            <h1 className="font-display text-3xl text-primary">Kalite Kontrol Kontrol Listeleri</h1>
            <p className="text-muted-foreground">Oda sıfırlama, prop kontrolü ve ipucu yenileme planları</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="atelier-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Plan'}
          </Button>
        </div>

        {showForm && (
          <Card className="atelier-card">
            <CardHeader>
              <CardTitle className="font-display">Kalite Kontrol Planı Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Başlık</Label>
                  <Input id="title" value={form.title} onChange={(e) => update('title', e.target.value)} required placeholder="Örn: Tam sıfırlama — Starship Bridge" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">Açıklama</Label>
                  <Input id="description" value={form.description} onChange={(e) => update('description', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <select id="category" value={form.category} onChange={(e) => update('category', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{formatQualityChecklistCategory(c)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone">Kanat / Bölüm</Label>
                  <Input id="zone" value={form.zone} onChange={(e) => update('zone', e.target.value)} placeholder="Örn: Basement Zone" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Planlanan Tarih</Label>
                  <Input id="scheduledAt" type="datetime-local" value={form.scheduledAt} onChange={(e) => update('scheduledAt', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <select id="status" value={form.status} onChange={(e) => update('status', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{formatQualityChecklistStatus(s)}</option>
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
          <EmptyState title="Kalite Kontrol planı yok" description="Henüz sıfırlama kontrol listesi eklenmemiş." />
        )}
        {!loading && items.length > 0 && (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="atelier-card">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <ClipboardCheck className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatQualityChecklistCategory(item.category)} · {item.zone || 'Genel'} · {formatDateTime(item.scheduledAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{formatQualityChecklistStatus(item.status)}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
