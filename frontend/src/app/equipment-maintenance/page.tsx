'use client';

import { useEffect, useState } from 'react';
import { Plus, Puzzle } from 'lucide-react';
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
  formatEquipmentMaintenanceStatus,
  formatEquipmentMaintenancePriority,
} from '@/lib/utils';

interface WorkstationOption {
  id: string;
  name: string;
  zone: string;
}

interface EquipmentMaintenanceItem {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  reportedAt: string;
  workstation?: { name: string; zone: string };
}

interface ListResponse {
  data: EquipmentMaintenanceItem[];
  total: number;
}

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const STATUSES = ['open', 'in_progress', 'completed', 'cancelled'];

const emptyForm = {
  workstationId: '',
  title: '',
  description: '',
  priority: 'medium',
  status: 'open',
};

export default function EquipmentMaintenancePage() {
  const { token } = useAuth();
  const [items, setItems] = useState<EquipmentMaintenanceItem[]>([]);
  const [workstations, setWorkstations] = useState<WorkstationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    Promise.all([api.equipmentMaintenance.list(token), api.workstations.list(token)])
      .then(([itemsRes, roomsRes]) => {
        setItems((itemsRes as ListResponse).data);
        setWorkstations(
          ((roomsRes as { data: WorkstationOption[] }).data || []).map((r) => ({
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
      await api.equipmentMaintenance.create(token, {
        workstationId: form.workstationId,
        title: form.title,
        description: form.description || undefined,
        priority: form.priority,
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
            <h1 className="font-display text-3xl text-primary">Ekipman Bakımı</h1>
            <p className="text-muted-foreground">Kilit, mekanizma ve prop arıza kayıtları</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="atelier-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Kayıt'}
          </Button>
        </div>

        {showForm && (
          <Card className="atelier-card">
            <CardHeader>
              <CardTitle className="font-display">Bakım Kaydı Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="workstationId">Terzi Atölyesi</Label>
                  <select
                    id="workstationId"
                    value={form.workstationId}
                    onChange={(e) => update('workstationId', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    required
                  >
                    <option value="">Oda seçin</option>
                    {workstations.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} — {r.zone}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Başlık</Label>
                  <Input id="title" value={form.title} onChange={(e) => update('title', e.target.value)} required placeholder="Örn: RFID kilit arızası" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">Açıklama</Label>
                  <Input id="description" value={form.description} onChange={(e) => update('description', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Öncelik</Label>
                  <select id="priority" value={form.priority} onChange={(e) => update('priority', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>{formatEquipmentMaintenancePriority(p)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <select id="status" value={form.status} onChange={(e) => update('status', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{formatEquipmentMaintenanceStatus(s)}</option>
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
          <EmptyState title="Bakım kaydı yok" description="Henüz bulmaca bakım kaydı eklenmemiş." />
        )}
        {!loading && items.length > 0 && (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="atelier-card">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Puzzle className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.workstation?.name || 'İstasyon belirtilmemiş'} · {item.workstation?.zone} · {formatEquipmentMaintenancePriority(item.priority)} · {formatDateTime(item.reportedAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{formatEquipmentMaintenanceStatus(item.status)}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
