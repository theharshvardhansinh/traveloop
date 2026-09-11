import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Bootstrap: restore session from localStorage ──────────────
  useEffect(() => {
    const storedToken = localStorage.getItem('traveloop_token');
    const storedUser  = localStorage.getItem('traveloop_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        // Corrupted data — clear it
        localStorage.removeItem('traveloop_token');
        localStorage.removeItem('traveloop_user');
      }
    }
    setLoading(false);
  }, []);

  // ─── login: persist token + user, update state ─────────────────────────────
  const login = useCallback((tokenValue, userData) => {
    localStorage.setItem('traveloop_token', tokenValue);
    localStorage.setItem('traveloop_user', JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  }, []);

  // ─── logout: clear everything ──────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('traveloop_token');
    localStorage.removeItem('traveloop_user');
    setToken(null);
    setUser(null);
  }, []);

  // ─── refreshUser: re-fetch /me to get fresh user data ─────────────────────
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/auth/me');
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('traveloop_user', JSON.stringify(data.user));
      }
    } catch {
      logout();
    }
  }, [logout]);

  const value = {
    user,
    token,
    role: user?.role ?? null,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─── Custom hook ───────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return ctx;
};

export default AuthContext;
