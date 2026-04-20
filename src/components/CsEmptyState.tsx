import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import Button from '@mui/material/Button';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CsEmptyStateVariant = 'default' | 'inline';

export interface CsEmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'contained' | 'outlined' | 'ghost';
}

export interface CsEmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CsEmptyStateVariant;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: CsEmptyStateAction;
}

// ─── Styled slots ─────────────────────────────────────────────────────────────

const CsEmptyStateRoot = styled('div', {
  name: 'MuiCsEmptyState',
  slot: 'root',
  shouldForwardProp: (prop) =>
    !['variant', 'icon', 'title', 'description', 'action'].includes(prop as string),
})<{ variant?: CsEmptyStateVariant }>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  borderRadius: `${theme.radius.lg}px`,
  border: `1px dashed ${theme.border.default}`,
  backgroundColor: theme.surface.subtle,
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[800],
    borderColor: theme.palette.grey[600],
  }),

  variants: [
    {
      props: { variant: 'inline' as const },
      style: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        border: 'none',
        backgroundColor: 'transparent',
        ...theme.applyStyles('dark', { backgroundColor: 'transparent' }),
      },
    },
  ],
}));

const CsEmptyStateIconWrapper = styled('div', {
  name: 'MuiCsEmptyState',
  slot: 'iconWrapper',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: `${theme.radius.lg}px`,
  backgroundColor: theme.fill.default,
  color: theme.vars.palette.text.secondary,
  ...theme.applyStyles('dark', { backgroundColor: theme.palette.grey[700] }),
}));

const CsEmptyStateTitle = styled('div', { name: 'MuiCsEmptyState', slot: 'title' })(
  ({ theme }) => ({
    ...theme.typography.subtitle1,
    fontWeight: theme.typography.fontWeightSemibold,
    color: theme.vars.palette.text.primary,
    marginBottom: theme.spacing(1),
  }),
);

const CsEmptyStateDescription = styled('div', {
  name: 'MuiCsEmptyState',
  slot: 'description',
})(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.vars.palette.text.secondary,
  maxWidth: 380,
  marginBottom: theme.spacing(3),
}));

// ─── Component ────────────────────────────────────────────────────────────────

export const CsEmptyState = React.forwardRef<HTMLDivElement, CsEmptyStateProps>(
  function CsEmptyState(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiCsEmptyState' });
    const { variant = 'default', icon, title, description, action, ...other } = props;

    return (
      <CsEmptyStateRoot ref={ref} variant={variant} {...other}>
        {icon && (
          <CsEmptyStateIconWrapper aria-hidden="true">{icon}</CsEmptyStateIconWrapper>
        )}
        <CsEmptyStateTitle>{title}</CsEmptyStateTitle>
        {description && (
          <CsEmptyStateDescription>{description}</CsEmptyStateDescription>
        )}
        {action && (
          <Button variant={action.variant ?? 'outlined'} onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </CsEmptyStateRoot>
    );
  },
);
