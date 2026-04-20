import type { Components, Theme } from '@mui/material/styles';

export const MuiDivider: Components<Theme>['MuiDivider'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderColor: theme.border.subtle,
      ...theme.applyStyles('dark', {
        borderColor: theme.palette.grey[700],
      }),
    }),
  },
};
