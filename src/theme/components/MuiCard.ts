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
        {
          // interactive — clickable card with border, lift-on-hover, and clipped thumbnail
          // Explicit border needed: custom variant bypasses MUI Paper's outlined border
          props: { variant: 'interactive' },
          style: {
            border: `1px solid ${theme.border.default}`,
            overflow: 'hidden',
            transition: theme.transitions.create(
              ['box-shadow', 'border-color', 'transform'],
              { duration: theme.transitions.duration.short, easing: theme.transitions.easing.easeInOut },
            ),
            '&:hover': {
              borderColor: theme.border.strong,
              boxShadow: theme.shadows[theme.elevation.low],
              transform: 'translateY(-1px)',
            },
          },
        },
      ],
    }),
  },
};
