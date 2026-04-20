import type { Components, Theme } from '@mui/material/styles';
import { focusRing } from '../recipes';

export const MuiButton: Components<Theme>['MuiButton'] = {
  defaultProps: { disableElevation: true },
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.radius.md,
      height: 36,
      padding: `0 ${theme.spacing(3)}`,
      borderWidth: 1,
      borderStyle: 'solid',
      ...theme.typography.button,
      transition: theme.motion.short,
      '&:focus-visible': focusRing(theme),
      '&.Mui-disabled': {
        backgroundColor: theme.palette.action.disabledBackground,
        borderColor:     theme.palette.action.disabledBackground,
        color:           theme.palette.action.disabled,
      },
      variants: [
        { props: { size: 'small' }, style: { height: 28, padding: `0 ${theme.spacing(2)}` } },
        { props: { size: 'large' }, style: { height: 44, padding: `0 ${theme.spacing(4)}` } },
        {
          props: { variant: 'ghost' },
          style: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            color: theme.palette.primary.main,
            '&:hover': { backgroundColor: theme.palette.action.hover },
          },
        },
      ],
    }),
  },
};
