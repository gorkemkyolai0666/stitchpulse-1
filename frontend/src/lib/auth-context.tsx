'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface TailoringShop {
  id: string;
  name: string;
}

interface AuthState {
  user: User | null;
  tailoringShop: TailoringShop | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    tailoringShopName: string;
    phone?: string;
    city?: string;
    state?: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const TOKEN_KEY = 'stitchpulse_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tailoringShop, setTailoringShop] = useState<TailoringShop | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) {
      api.auth
        .me(saved)
        .then((data) => {
          const result = data as { user: User; tailoringShop: TailoringShop };
          setUser(result.user);
          setTailoringShop(result.tailoringShop);
          setToken(saved);
        })
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = (await api.auth.login({ email, password })) as {
      accessToken: string;
      user: User;
      tailoringShop: TailoringShop;
    };
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    setToken(data.accessToken);
    setUser(data.user);
    setTailoringShop(data.tailoringShop);
  }, []);

  const register = useCallback(
    async (registerData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      tailoringShopName: string;
      phone?: string;
      city?: string;
      state?: string;
    }) => {
      const data = (await api.auth.register(registerData)) as {
        accessToken: string;
        user: User;
        tailoringShop: TailoringShop;
      };
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      setToken(data.accessToken);
      setUser(data.user);
      setTailoringShop(data.tailoringShop);
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setTailoringShop(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, tailoringShop, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
