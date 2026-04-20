import { alpha } from '@mui/material/styles';
import type { Theme, CSSObject } from '@mui/material/styles';

type Intent = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'neutral';

// ─── Interaction recipes ──────────────────────────────────────────────────────

export function focusRing(theme: Theme): CSSObject {
  return {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
    boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, theme.palette.action.focusOpacity * 2.7)}`,
  };
}

export function softTint(theme: Theme, intent: Intent): CSSObject {
  const color = theme.palette[intent].main;
  return {
    backgroundColor: alpha(color, theme.palette.action.hoverOpacity * 2),
    color: theme.palette[intent].dark,
  };
}

export function selectedSurface(theme: Theme): CSSObject {
  return {
    backgroundColor: theme.palette.action.selected,
    color: theme.palette.primary.main,
  };
}

