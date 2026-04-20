import type { Components, Theme } from '@mui/material/styles';
import { softTint } from '../recipes';

const INTENT_COLORS = [
  'primary', 'secondary', 'error', 'warning', 'info', 'success', 'neutral',
] as const;

export const MuiChip: Components<Theme>['MuiChip'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.radius.sm,
      transition: theme.motion.short,

      variants: [
        // filled default — neutral fill
        {
          props: { color: 'default' },
          style: {
            backgroundColor: theme.fill.default,
            ...theme.applyStyles('dark', {
              backgroundColor: theme.palette.grey[700],
            }),
          },
        },

        // soft — tinted bg, intent text, no border
        {
          props: { variant: 'soft', color: 'default' },
          style: {
            backgroundColor: theme.fill.emphasis,
            border: 'none',
            ...theme.applyStyles('dark', {
              backgroundColor: theme.palette.grey[600],
            }),
          },
        },
        ...INTENT_COLORS.map((color) => ({
          props: { variant: 'soft' as const, color },
          style: {
            ...softTint(theme, color === 'secondary' ? 'primary' : color),
            border: 'none',
          },
        })),
      ],
    }),
  },
};
