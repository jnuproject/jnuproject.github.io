import React, { createContext, ReactNode, useContext } from 'react';

type ThemeContextType = {
  colors: {
    background: string;
    text: string;
    textSecondary: string;
    card: string;
    primary: string;
  };
};

const lightColors = {
  background: '#FFFFFF',
  text: '#000000',
  textSecondary: '#555555',
  card: '#F8F8F8',
  primary: '#007AFF',
};

const ThemeContext = createContext<ThemeContextType>({ colors: lightColors });

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={{ colors: lightColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);