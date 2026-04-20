import type { Components, Theme } from '@mui/material/styles';
import { softTint } from '../recipes';

const INTENT_COLORS = ['primary', 'secondary', 'error', 'warning', 'info', 'success', 'neutral'] as const;

export const MuiAvatar: Components<Theme>['MuiAvatar'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      variants: [
        // soft — neutral tint default
        {
          props: { variant: 'soft' as const },
          style: {
            backgroundColor: theme.fill.default,
            color: theme.palette.text.primary,
          },
        },
        // soft + intent color — palette-tinted background
        ...INTENT_COLORS.map((color) => ({
          props: { variant: 'soft' as const, color },
          style: softTint(theme, color),
        })),

        // outlined — subtle ring at rest (no color prop)
        {
          props: { variant: 'outlined' as const },
          style: {
            boxShadow: `0 0 0 2px ${theme.border.default}`,
            ...theme.applyStyles('dark', {
              boxShadow: `0 0 0 2px ${theme.palette.grey[600]}`,
            }),
          },
        },
        // outlined + intent color — colored ring
        ...INTENT_COLORS.map((color) => ({
          props: { variant: 'outlined' as const, color },
          style: {
            boxShadow: `0 0 0 2px ${theme.palette[color].main}`,
          },
        })),
      ],
    }),
  },
};
