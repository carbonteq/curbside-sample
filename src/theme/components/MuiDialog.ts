import type { Components, Theme } from '@mui/material/styles';

export const MuiDialog: Components<Theme>['MuiDialog'] = {
  styleOverrides: {
    paper: ({ theme }) => ({
      borderRadius: theme.radius.lg,
      backgroundColor: theme.surface.overlay,
      boxShadow: theme.shadows[theme.elevation.high],
      ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.grey[800],
      }),
    }),
  },
};
