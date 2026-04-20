import { alpha } from '@mui/material/styles';
import type { Components, Theme } from '@mui/material/styles';
import { focusRing } from '../recipes';

export const MuiSwitch: Components<Theme>['MuiSwitch'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .MuiSwitch-switchBase': {
        '&:focus-visible + .MuiSwitch-track': focusRing(theme),
      },

      variants: [
        // soft — muted track; thumb inherits primary on checked
        {
          props: { color: 'soft' as const },
          style: {
            '& .MuiSwitch-track': {
              backgroundColor: alpha(theme.palette.action.active, 0.2),
              opacity: 1,
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: alpha(theme.palette.primary.main, 0.35),
              opacity: 1,
            },
            '& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb': {
              color: theme.palette.primary.main,
            },
          },
        },
      ],
    }),
  },
};
