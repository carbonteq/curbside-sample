import type { Components, Theme } from '@mui/material/styles';

export const MuiCard: Components<Theme>['MuiCard'] = {
  defaultProps: { elevation: 0, variant: 'outlined' },
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.radius.lg,
      borderColor: theme.border.default,
      backgroundColor: theme.surface.canvas,
      transition: theme.motion.standard,

      ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.grey[800],
        borderColor:     theme.palette.grey[700],
      }),

      variants: [
        {
          // subtle — sits one tone above canvas; for secondary panels and info cards
          props: { variant: 'subtle' },
          style: {
            backgroundColor: theme.surface.subtle,
            borderColor: theme.border.subtle,
            ...theme.applyStyles('dark', {
              backgroundColor: theme.palette.grey[850] ?? theme.palette.grey[800],
              borderColor: theme.palette.grey[700],
            }),
          },
        },
        {
          // raised — elevated surface for featured or highlighted content; no shadow
          props: { variant: 'raised' },
          style: {
            backgroundColor: theme.surface.raised,
            borderColor: theme.border.default,
            ...theme.applyStyles('dark', {
              backgroundColor: theme.palette.grey[700],
              borderColor: theme.palette.grey[600],
            }),
          },
        },
      ],
    }),
  },
};
