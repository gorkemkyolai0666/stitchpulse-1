'use client';

import { useEffect, useState } from 'react';
import { Plus, Users } from 'lucide-react';
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
  formatDateTime,
  formatHarvestStatus,
  formatBayClimateType,
  formatHarvestType,
} from '@/lib/utils';

interface GreenhouseBayOption {
  id: string;
  name: string;
  zone: string;
}

interface HarvestBatch {
  id: string;
  cashSales: number;
  cardSales: number;
  rushPremium: number;
  unitCount: number;
  harvestedAt: string;
  harvestType?: string;
  status: string;
  greenhouseBay?: { id: string; name: string; zone: string; climateType: string };
}

interface ListResponse {
  data: HarvestBatch[];
  total: number;
}

const SESSION_STATUSES = ['recorded', 'verified', 'disputed'];
const GAME_TYPES = ['private_group', 'corporate', 'birthday', 'date_night', 'team_building'];

const emptyForm = {
  greenhouseBayId: '',
  harvestType: 'private_group',
  cashSales: '0',
  cardSales: '0',
  rushPremium: '0',
  unitCount: '0',
  harvestedAt: new Date().toISOString().slice(0, 16),
  status: 'recorded',
};

export default function HarvestBatchesPage() {
  const { token } = useAuth();
  const [sessions, setSessions] = useState<HarvestBatch[]>([]);
  const [greenhouseBays, setGreenhouseBays] = useState<GreenhouseBayOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    Promise.all([api.harvestBatches.list(token), api.greenhouseBays.list(token)])
      .then(([sessionsRes, roomsRes]) => {
        setSessions((sessionsRes as ListResponse).data);
        setGreenhouseBays(
          ((roomsRes as { data: GreenhouseBayOption[] }).data || []).map((r) => ({
            id: r.id,
            name: r.name,
            zone: r.zone,
          })),
        );
      })
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
      await api.harvestBatches.create(token, {
        greenhouseBayId: form.greenhouseBayId,
        harvestType: form.harvestType,
        cashSales: parseFloat(form.cashSales),
        cardSales: parseFloat(form.cardSales),
        rushPremium: parseFloat(form.rushPremium),
        unitCount: parseInt(form.unitCount, 10),
        harvestedAt: form.harvestedAt,
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
            <h1 className="font-display text-3xl text-primary">Hasat İşleri</h1>
            <p className="text-muted-foreground">Günlük oyun geliri ve oturum kayıtları</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="atelier-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Oturum'}
          </Button>
        </div>

        {showForm && (
          <Card className="atelier-card">
            <CardHeader>
              <CardTitle className="font-display">Hasat İşi Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="greenhouseBayId">Bahçıvan Fidanlıksi</Label>
                  <select
                    id="greenhouseBayId"
                    value={form.greenhouseBayId}
                    onChange={(e) => update('greenhouseBayId', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    required
                  >
                    <option value="">Oda seçin</option>
                    {greenhouseBays.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} — {r.zone}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="harvestType">İş Tipi</Label>
                  <select
                    id="harvestType"
                    value={form.harvestType}
                    onChange={(e) => update('harvestType', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {GAME_TYPES.map((t) => (
                      <option key={t} value={t}>{formatHarvestType(t)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitCount">Katılımcı Sayısı</Label>
                  <Input id="unitCount" type="number" min={0} value={form.unitCount} onChange={(e) => update('unitCount', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cashSales">Nakit ($)</Label>
                  <Input id="cashSales" type="number" min={0} step="0.01" value={form.cashSales} onChange={(e) => update('cashSales', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardSales">Kart ($)</Label>
                  <Input id="cardSales" type="number" min={0} step="0.01" value={form.cardSales} onChange={(e) => update('cardSales', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rushPremium">Ek Gelir ($)</Label>
                  <Input id="rushPremium" type="number" min={0} step="0.01" value={form.rushPremium} onChange={(e) => update('rushPremium', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="harvestedAt">Oturum Tarihi</Label>
                  <Input id="harvestedAt" type="datetime-local" value={form.harvestedAt} onChange={(e) => update('harvestedAt', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <select id="status" value={form.status} onChange={(e) => update('status', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {SESSION_STATUSES.map((s) => (
                      <option key={s} value={s}>{formatHarvestStatus(s)}</option>
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
        {error && !loading && sessions.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && sessions.length === 0 && (
          <EmptyState title="Oturum bulunamadı" description="Henüz oyun oturumu eklenmemiş." />
        )}
        {!loading && sessions.length > 0 && (
          <div className="space-y-3">
            {sessions.map((session) => (
              <Card key={session.id} className="atelier-card">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-semibold">{session.greenhouseBay?.name || '—'}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.greenhouseBay?.zone} · {formatBayClimateType(session.greenhouseBay?.climateType || '')} · {formatHarvestType(session.harvestType || '')} · {session.unitCount} parça
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(session.harvestedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-semibold">
                      {formatCurrency(session.cashSales + session.cardSales + session.rushPremium)}
                    </span>
                    <Badge variant="secondary">{formatHarvestStatus(session.status)}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
