import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CsSidebarItemAlignItems = 'center' | 'flex-start';

export interface CsSidebarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  alignItems?: CsSidebarItemAlignItems;
}

// ─── Styled root ──────────────────────────────────────────────────────────────

const CsSidebarItemRoot = styled('div', {
  name: 'MuiCsSidebarItem',
  slot: 'root',
  shouldForwardProp: (prop) => prop !== 'alignItems',
})<{ alignItems?: CsSidebarItemAlignItems }>(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: `${theme.radius.md}px`,
  border: `1px solid ${theme.border.default}`,
  backgroundColor: theme.surface.canvas,
  cursor: 'pointer',
  transition: theme.motion.short,
  '&:hover': {
    backgroundColor: theme.surface.raised,
  },
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[900],
    borderColor: theme.palette.grey[700],
    '&:hover': {
      backgroundColor: theme.palette.grey[700],
    },
  }),

  variants: [
    {
      props: { alignItems: 'center' as const },
      style: { alignItems: 'center' },
    },
    {
      props: { alignItems: 'flex-start' as const },
      style: { alignItems: 'flex-start' },
    },
  ],
}));

// ─── Component ────────────────────────────────────────────────────────────────

export const CsSidebarItem = React.forwardRef<HTMLDivElement, CsSidebarItemProps>(
  function CsSidebarItem(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiCsSidebarItem' });
    const { alignItems = 'center', ...other } = props;
    return <CsSidebarItemRoot ref={ref} alignItems={alignItems} {...other} />;
  },
);
