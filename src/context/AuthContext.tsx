import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';
import * as authService from "../services/authService";
import { User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: any) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedAuth = await SecureStore.getItemAsync("auth");
        if (storedAuth) {
          const { user, token } = JSON.parse(storedAuth);
          setUser(user);
          setToken(token);
        }
      } catch (error) {
        console.error("Failed to load auth data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAuthData();
  }, []);

  const login = async (data: any) => {
    const res = await authService.loginUser(data);
    await SecureStore.setItemAsync("auth", JSON.stringify(res));
    setUser(res.user);
    setToken(res.token);
    return res;
  };

  const register = async (data: any) => {
    const res = await authService.registerUser(data);
    return res;
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("auth");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
