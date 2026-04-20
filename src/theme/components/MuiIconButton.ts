import { alpha } from '@mui/material/styles';
import type { Components, Theme } from '@mui/material/styles';
import { softTint, focusRing } from '../recipes';

const INTENT_COLORS = [
  'primary', 'secondary', 'error', 'warning', 'info', 'success', 'neutral',
] as const;

export const MuiIconButton: Components<Theme>['MuiIconButton'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.radius.md,
      transition: theme.motion.short,
      '&:focus-visible': focusRing(theme),

      variants: [
        // ── contained ─────────────────────────────────────────────────────────
        {
          props: { variant: 'contained' },
          style: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': { backgroundColor: theme.palette.primary.dark },
          },
        },
        ...INTENT_COLORS.map((color) => ({
          props: { variant: 'contained' as const, color },
          style: {
            backgroundColor: theme.palette[color].main,
            color: theme.palette[color].contrastText,
            '&:hover': { backgroundColor: theme.palette[color].dark },
          },
        })),

        // ── soft ──────────────────────────────────────────────────────────────
        {
          props: { variant: 'soft' },
          style: {
            backgroundColor: theme.fill.default,
            color: theme.palette.text.primary,
            '&:hover': { backgroundColor: theme.fill.emphasis },
            ...theme.applyStyles('dark', {
              backgroundColor: theme.palette.grey[700],
              '&:hover': { backgroundColor: theme.palette.grey[600] },
            }),
          },
        },
        ...INTENT_COLORS.map((color) => ({
          props: { variant: 'soft' as const, color },
          style: softTint(theme, color),
        })),

        // ── ghost ─────────────────────────────────────────────────────────────
        {
          props: { variant: 'ghost' },
          style: {
            color: theme.palette.text.primary,
            '&:hover': { backgroundColor: theme.palette.action.hover },
          },
        },
        ...INTENT_COLORS.map((color) => ({
          props: { variant: 'ghost' as const, color },
          style: {
            color: theme.palette[color].main,
            '&:hover': {
              backgroundColor: alpha(
                theme.palette[color].main,
                theme.palette.action.hoverOpacity,
              ),
            },
          },
        })),

        // ── size tweaks ───────────────────────────────────────────────────────
        { props: { size: 'small' },  style: { borderRadius: theme.radius.sm } },
        { props: { size: 'large' },  style: { borderRadius: theme.radius.lg } },
      ],
    }),
  },
};
