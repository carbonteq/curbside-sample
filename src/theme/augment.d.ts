import type * as React from 'react';
import type {
  ComponentsOverrides,
  ComponentsVariants,
} from '@mui/material/styles';
import '@mui/material/styles';
import '@mui/material/Avatar';
import '@mui/material/Button';
import '@mui/material/Chip';
import '@mui/material/Alert';
import '@mui/material/Card';
import '@mui/material/OutlinedInput';
import '@mui/material/Switch';
import '@mui/material/IconButton';
import '@mui/material/Tabs';
import '@mui/material/Accordion';

// ─── Theme token extensions ───────────────────────────────────────────────────

declare module '@mui/material/styles' {
  interface Theme {
    surface:   { canvas: string; subtle: string; raised: string; overlay: string; scrim: string };
    fill:      { default: string; emphasis: string; selected: string };
    border:    { subtle: string; default: string; strong: string };
    radius:    { sm: number; md: number; lg: number; pill: number };
    motion:    { short: string; standard: string; complex: string; enter: string; leave: string };
    elevation: { none: 0; low: number; high: number };
    space: {
      '2xs': string; xs: string; sm: string; md: string; lg: string;
      xl: string; '2xl': string; '3xl': string; '4xl': string; '5xl': string;
    };
  }

  interface ThemeOptions {
    surface?:   Partial<Theme['surface']>;
    fill?:      Partial<Theme['fill']>;
    border?:    Partial<Theme['border']>;
    radius?:    Partial<Theme['radius']>;
    motion?:    Partial<Theme['motion']>;
    elevation?: Partial<Theme['elevation']>;
    space?:     Partial<Theme['space']>;
  }

  interface Palette        { neutral: Palette['primary'] }
  interface PaletteOptions { neutral?: PaletteOptions['primary'] }

  interface TypeText { muted: string }

  interface TypographyVariants        { fontWeightSemibold: number }
  interface TypographyVariantsOptions { fontWeightSemibold?: number }

  // ── Custom component class keys ────────────────────────────────────────────

  interface ComponentNameToClassKey {
    MuiCsStatCard:      'root' | 'header' | 'label' | 'icon' | 'value' | 'delta';
    MuiCsStatusDot:     'root' | 'dot' | 'label';
    MuiCsEmptyState:    'root' | 'iconWrapper' | 'title' | 'description';
    MuiCsSectionHeader: 'root' | 'row' | 'content' | 'title' | 'subtitle' | 'action';
  }

  // ── Custom component props lists ───────────────────────────────────────────

  interface ComponentsPropsList {
    MuiCsStatCard: Partial<{
      label:  string;
      value:  string | number;
      delta:  string;
      trend:  'up' | 'down' | 'neutral';
      icon:   React.ReactNode;
      color:  'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
    }>;
    MuiCsStatusDot: Partial<{
      status:    'online' | 'away' | 'busy' | 'offline';
      label:     string;
      size:      'sm' | 'md' | 'lg';
      showLabel: boolean;
    }>;
    MuiCsEmptyState: Partial<{
      variant:     'default' | 'inline';
      icon:        React.ReactNode;
      title:       string;
      description: string;
      action:      { label: string; onClick: () => void; variant?: 'contained' | 'outlined' | 'ghost' };
    }>;
    MuiCsSectionHeader: Partial<{
      variant:  'default' | 'divider';
      title:    string;
      subtitle: string;
      action:   React.ReactNode;
    }>;
  }

  // ── Custom component theme entries ─────────────────────────────────────────

  interface Components<Theme = unknown> {
    MuiCsStatCard?: {
      defaultProps?:   ComponentsPropsList['MuiCsStatCard'];
      styleOverrides?: ComponentsOverrides<Theme>['MuiCsStatCard'];
      variants?:       ComponentsVariants['MuiCsStatCard'];
    };
    MuiCsStatusDot?: {
      defaultProps?:   ComponentsPropsList['MuiCsStatusDot'];
      styleOverrides?: ComponentsOverrides<Theme>['MuiCsStatusDot'];
      variants?:       ComponentsVariants['MuiCsStatusDot'];
    };
    MuiCsEmptyState?: {
      defaultProps?:   ComponentsPropsList['MuiCsEmptyState'];
      styleOverrides?: ComponentsOverrides<Theme>['MuiCsEmptyState'];
      variants?:       ComponentsVariants['MuiCsEmptyState'];
    };
    MuiCsSectionHeader?: {
      defaultProps?:   ComponentsPropsList['MuiCsSectionHeader'];
      styleOverrides?: ComponentsOverrides<Theme>['MuiCsSectionHeader'];
      variants?:       ComponentsVariants['MuiCsSectionHeader'];
    };
  }
}

// ─── MUI built-in variant extensions ─────────────────────────────────────────

declare module '@mui/material/Avatar' {
  interface AvatarPropsVariantOverrides { soft: true; outlined: true }
  interface AvatarOwnProps {
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'neutral';
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides   { neutral: true }
  interface ButtonPropsVariantOverrides { ghost: true }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides   { neutral: true }
  interface ChipPropsVariantOverrides { soft: true }
}

declare module '@mui/material/Alert' {
  interface AlertPropsVariantOverrides { soft: true }
}

declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides { subtle: true; raised: true }
}

declare module '@mui/material/OutlinedInput' {
  interface OutlinedInputPropsColorOverrides { ghost: true; soft: true }
}

declare module '@mui/material/Switch' {
  interface SwitchPropsColorOverrides { soft: true }
}

declare module '@mui/material/IconButton' {
  interface IconButtonOwnProps {
    variant?: 'contained' | 'soft' | 'ghost';
  }
  interface IconButtonPropsColorOverrides { neutral: true }
}

declare module '@mui/material/Tabs' {
  interface TabsPropsVariantOverrides { pills: true }
}

declare module '@mui/material/Accordion' {
  interface AccordionOwnProps {
    variant?: 'default' | 'soft';
  }
}
