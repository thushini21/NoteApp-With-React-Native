import React, { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeColors {
  background: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  overlay: string;
}

interface ThemeContextType {
  theme: Theme;
  fontSize: number;
  themeColors: ThemeColors;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setFontSize: (fontSize: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const lightTheme: ThemeColors = {
  background: 'rgba(255, 255, 255, 0.95)',
  cardBackground: '#fff',
  textPrimary: '#333',
  textSecondary: '#555',
  textMuted: '#666',
  border: '#f0f0f0',
  overlay: 'rgba(0, 0, 0, 0.1)',
};

const darkTheme: ThemeColors = {
  background: 'rgba(30, 30, 30, 0.95)',
  cardBackground: '#2a2a2a',
  textPrimary: '#fff',
  textSecondary: '#e0e0e0',
  textMuted: '#b0b0b0',
  border: '#404040',
  overlay: 'rgba(255, 255, 255, 0.1)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [fontSize, setFontSizeState] = useState<number>(16);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setFontSize = (newFontSize: number) => {
    setFontSizeState(Math.max(12, Math.min(20, newFontSize))); // Clamp between 12 and 20
  };

  const increaseFontSize = () => {
    setFontSizeState(prev => Math.min(20, prev + 2));
  };

  const decreaseFontSize = () => {
    setFontSizeState(prev => Math.max(12, prev - 2));
  };

  const themeColors = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{
      theme,
      fontSize,
      themeColors,
      setTheme,
      toggleTheme,
      setFontSize,
      increaseFontSize,
      decreaseFontSize
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
