const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4018/api';

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'İstek başarısız' }));
    throw new ApiError(response.status, error.message || 'İstek başarısız');
  }

  return response.json();
}

export const api = {
  auth: {
    register: (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      nurseryName: string;
      phone?: string;
      city?: string;
      state?: string;
    }) => request('/auth/register', { method: 'POST', body: data }),

    login: (data: { email: string; password: string }) =>
      request('/auth/login', { method: 'POST', body: data }),

    me: (token: string) => request('/auth/me', { token }),
  },

  dashboard: {
    stats: (token: string) => request('/dashboard/stats', { token }),
  },

  greenhouseBays: {
    list: (token: string, params?: { page?: number; status?: string; zone?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      if (params?.zone) query.set('zone', params.zone);
      const qs = query.toString();
      return request(`/greenhouse-bays${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/greenhouse-bays', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/greenhouse-bays/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/greenhouse-bays/${id}`, { method: 'DELETE', token }),
  },

  harvestBatches: {
    list: (token: string, params?: { page?: number; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      const qs = query.toString();
      return request(`/harvest-batches${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/harvest-batches', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/harvest-batches/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/harvest-batches/${id}`, { method: 'DELETE', token }),
  },

  equipmentRepairs: {
    list: (token: string, params?: { status?: string; priority?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.priority) query.set('priority', params.priority);
      const qs = query.toString();
      return request(`/equipment-repairs${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/equipment-repairs', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/equipment-repairs/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/equipment-repairs/${id}`, { method: 'DELETE', token }),
  },

  irrigationSchedules: {
    list: (token: string, params?: { page?: number; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      const qs = query.toString();
      return request(`/irrigation-schedules${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/irrigation-schedules', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/irrigation-schedules/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/irrigation-schedules/${id}`, { method: 'DELETE', token }),
  },

  plantOrders: {
    list: (token: string, params?: { page?: number; status?: string; plantVariety?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      if (params?.plantVariety) query.set('plantVariety', params.plantVariety);
      const qs = query.toString();
      return request(`/plant-orders${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/plant-orders', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/plant-orders/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/plant-orders/${id}`, { method: 'DELETE', token }),
  },

  plantPricing: {
    list: (token: string, params?: { page?: number; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      const qs = query.toString();
      return request(`/plant-pricing${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/plant-pricing', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/plant-pricing/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/plant-pricing/${id}`, { method: 'DELETE', token }),
  },

  nursery: {
    get: (token: string) => request('/nursery', { token }),
    update: (token: string, data: Record<string, unknown>) =>
      request('/nursery', { method: 'PATCH', body: data, token }),
  },
};

export { ApiError };
