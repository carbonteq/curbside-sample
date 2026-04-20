import { darken } from '@mui/material/styles';
import type { Components, Theme } from '@mui/material/styles';
import { softTint } from '../recipes';

const SEVERITIES = ['error', 'warning', 'info', 'success'] as const;

// amber[800] (#f57f17) is too light for white text at 4.5:1.
// Darken warning bg so white text reaches the threshold.
const filledBg = (theme: Theme, severity: typeof SEVERITIES[number]) =>
  severity === 'warning'
    ? darken(theme.palette.warning.main, 0.35)
    : theme.palette[severity].main;

export const MuiAlert: Components<Theme>['MuiAlert'] = {
  defaultProps: { variant: 'outlined' },
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.radius.md,
      transition: theme.motion.short,

      variants: [
        // soft — tinted bg, no border, icon inherits intent color
        ...SEVERITIES.map((severity) => ({
          props: { variant: 'soft' as const, severity },
          style: {
            ...softTint(theme, severity),
            border: 'none',
            '& .MuiAlert-icon': { color: 'inherit', opacity: 0.9 },
          },
        })),

        // filled — explicit white text + contrast-safe bg on every severity
        ...SEVERITIES.map((severity) => ({
          props: { variant: 'filled' as const, severity },
          style: {
            backgroundColor: filledBg(theme, severity),
            color: theme.palette.common.white,
            '& .MuiAlert-icon': { color: theme.palette.common.white },
          },
        })),
      ],
    }),
  },
};
