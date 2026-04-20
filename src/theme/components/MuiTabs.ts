import type { Components, Theme } from '@mui/material/styles';

export const MuiTabs: Components<Theme>['MuiTabs'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      variants: [
        {
          props: { variant: 'pills' as const },
          style: {
            backgroundColor: theme.fill.default,
            borderRadius: `${theme.radius.pill}px`,
            padding: '2px',
            minHeight: 40,
            ...theme.applyStyles('dark', {
              backgroundColor: theme.palette.grey[800],
            }),
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTab-root': {
              borderRadius: `${theme.radius.pill}px`,
              minHeight: 32,
              padding: '6px 12px',
              fontSize: theme.typography.button.fontSize,
              fontWeight: theme.typography.fontWeightMedium,
              color: theme.palette.text.secondary,
              transition: theme.motion.short,
              '&.Mui-selected': {
                backgroundColor: theme.surface.canvas,
                color: theme.palette.text.primary,
                fontWeight: theme.typography.fontWeightSemibold,
                boxShadow: theme.shadows[theme.elevation.low],
                ...theme.applyStyles('dark', {
                  backgroundColor: theme.palette.grey[700],
                }),
              },
            },
          },
        },
      ],
    }),
    indicator: ({ theme }) => ({
      height: 2,
      borderRadius: `${theme.radius.pill}px`,
    }),
  },
};
