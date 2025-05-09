import React, { createContext, useContext, useState } from 'react';
import { nttd_theme } from '../themes/nttd_theme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context.theme;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(nttd_theme);

  const value = {
    theme: currentTheme,
    setTheme: setCurrentTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </ThemeContext.Provider>
  );
}; 