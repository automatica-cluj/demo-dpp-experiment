import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.medium,
        boxShadow: theme.shadows.small,
        display: 'inline-flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
      }}
    >
      <span
        style={{
          color: theme.colors.text.primary,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.fontSize.small,
        }}
      >
        Current Theme: {theme.name}
      </span>
    </div>
  );
};

export default ThemeToggle; 