import type { Components, Theme } from '@mui/material/styles';
import { focusRing } from '../recipes';

export const MuiListItemButton: Components<Theme>['MuiListItemButton'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.radius.md,
      padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
      color: theme.vars.palette.text.secondary,
      transition: theme.motion.short,
      '&:hover': { backgroundColor: theme.vars.palette.action.hover },
      '&.Mui-selected': {
        backgroundColor: theme.vars.palette.action.selected,
        color: theme.vars.palette.primary.main,
        fontWeight: theme.typography.fontWeightSemibold,
        borderLeft: `3px solid ${theme.palette.primary.main}`,
        '&:hover': { backgroundColor: theme.vars.palette.action.selected },
      },
      '&:focus-visible': focusRing(theme),
    }),
  },
};
