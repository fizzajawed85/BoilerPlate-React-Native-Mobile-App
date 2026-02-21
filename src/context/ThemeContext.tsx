import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import * as SecureStore from 'expo-secure-store';

type ThemeMode = 'light' | 'dark';

interface ThemeColors {
  background: string;
  card: string;
  text: string;
  secondaryText: string;
  border: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  muted: string;
}

const lightColors: ThemeColors = {
  background: '#f8fafc',
  card: '#ffffff',
  text: '#1e293b',
  secondaryText: '#64748b',
  border: '#e2e8f0',
  primary: '#6366f1', // Indigo-500 for brand consistency
  secondary: '#4f46e5', // Indigo-600
  accent: '#f5f3ff', // Very light violet
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#f43f5e',
  muted: '#94a3b8',
};

const darkColors: ThemeColors = {
  background: '#0a0f1d', // deeper midnight blue
  card: '#161e31', // subtle dark-blue cards
  text: '#f8fafc',
  secondaryText: '#94a3b8',
  border: '#1e293b',
  primary: '#6366f1', // Premium Indigo
  secondary: '#818cf8',
  accent: '#161e31', // matches card for glass feel
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#f43f5e',
  muted: '#334155',
};

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemColorScheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await SecureStore.getItemAsync('theme_mode');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setMode(storedTheme);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    await SecureStore.setItemAsync('theme_mode', newMode);
  };

  const colors = mode === 'light' ? lightColors : darkColors;
  const isDark = mode === 'dark';

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
