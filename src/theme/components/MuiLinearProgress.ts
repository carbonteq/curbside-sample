import type { Components, Theme } from '@mui/material/styles';

export const MuiLinearProgress: Components<Theme>['MuiLinearProgress'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.radius.pill,
      height: 6,
      backgroundColor: theme.fill.default,
      ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.grey[700],
      }),
    }),
    bar: {
      borderRadius: 'inherit',
    },
  },
};
