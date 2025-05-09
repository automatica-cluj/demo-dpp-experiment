import styled from 'styled-components';

export const createStyledComponent = (Component, styles) => {
  return styled(Component)`
    ${({ theme }) => styles(theme)}
  `;
};

export const Button = createStyledComponent('button', (theme) => ({
  backgroundColor: theme.colors.primary.main,
  color: theme.colors.primary.contrastText,
  border: 'none',
  borderRadius: theme.components.button.borderRadius,
  padding: theme.components.button.padding.medium,
  fontSize: theme.typography.fontSize.sm,
  fontWeight: theme.typography.fontWeight.regular,
  '&:hover': {
    backgroundColor: theme.colors.primary.dark,
  },
  '&:disabled': {
    backgroundColor: theme.colors.grey.shades[200],
    color: theme.colors.grey.shades[400],
    cursor: 'not-allowed',
  },
}));

export const Input = createStyledComponent('input', (theme) => ({
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.components.input.borderRadius,
  padding: theme.spacing.sm,
  fontSize: theme.typography.fontSize.sm,
  '&:focus': {
    borderColor: theme.colors.border.focus,
    outline: 'none',
  },
}));

export const Table = createStyledComponent('table', (theme) => ({
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: theme.colors.background.default,
  '& th': {
    backgroundColor: theme.components.table.headerBackground,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.bold,
    padding: theme.spacing.md,
    textAlign: 'left',
  },
  '& td': {
    padding: theme.spacing.md,
    borderBottom: `1px solid ${theme.components.table.borderColor}`,
  },
  '& tr:hover': {
    backgroundColor: theme.components.table.rowHoverBackground,
  },
}));

export const Card = createStyledComponent('div', (theme) => ({
  backgroundColor: theme.colors.background.default,
  borderRadius: theme.borderRadius.medium,
  padding: theme.spacing.lg,
  boxShadow: theme.shadows.small,
}));

export const Typography = createStyledComponent('span', (theme) => ({
  fontFamily: theme.typography.fontFamily,
  color: theme.colors.text.primary,
  '&.h1': {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    lineHeight: theme.typography.lineHeight.heading,
  },
  '&.h2': {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    lineHeight: theme.typography.lineHeight.heading,
  },
  '&.body1': {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.normal,
  },
  '&.body2': {
    fontSize: theme.typography.fontSize.xs,
    lineHeight: theme.typography.lineHeight.normal,
  },
})); 