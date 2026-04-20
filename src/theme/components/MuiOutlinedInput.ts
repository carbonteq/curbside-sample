import { alpha } from '@mui/material/styles';
import type { Components, Theme } from '@mui/material/styles';
import { focusRing } from '../recipes';

export const MuiOutlinedInput: Components<Theme>['MuiOutlinedInput'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.radius.md,
      transition: theme.motion.short,
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.border.strong,
      },
      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
      },
      '&.Mui-error .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.error.main,
        borderWidth: 2,
      },
      '&:focus-visible': focusRing(theme),

      variants: [
        // ghost — borderless at rest; border appears on hover/focus
        {
          props: { color: 'ghost' as const },
          style: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.border.default,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
            },
          },
        },
        // soft — tinted surface background with a subtle border
        {
          props: { color: 'soft' as const },
          style: {
            backgroundColor: theme.surface.subtle,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.border.subtle,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.border.default,
            },
            '&.Mui-focused': {
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            },
          },
        },
      ],
    }),
    notchedOutline: ({ theme }) => ({
      borderColor: theme.border.default,
    }),
  },
};
