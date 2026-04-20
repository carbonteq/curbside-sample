import type { Components, Theme } from '@mui/material/styles';

export const MuiAccordion: Components<Theme>['MuiAccordion'] = {
  defaultProps: { disableGutters: true, elevation: 0, square: false },
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: `${theme.radius.lg}px !important`,
      border: `1px solid ${theme.border.default}`,
      backgroundColor: theme.surface.canvas,
      transition: theme.motion.standard,
      '&:before': { display: 'none' },
      '&:not(:last-child)': { marginBottom: theme.spacing(1) },
      ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.grey[800],
        borderColor: theme.palette.grey[700],
      }),

      variants: [
        {
          props: { variant: 'soft' as const },
          style: {
            backgroundColor: theme.surface.subtle,
            borderColor: theme.border.subtle,
            '& .MuiAccordionSummary-root': {
              backgroundColor: 'transparent',
            },
            ...theme.applyStyles('dark', {
              backgroundColor: theme.palette.grey[850] ?? theme.palette.grey[800],
              borderColor: theme.palette.grey[700],
            }),
          },
        },
      ],
    }),
  },
};

export const MuiAccordionSummary: Components<Theme>['MuiAccordionSummary'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: `${theme.radius.lg}px`,
      padding: `0 ${theme.spacing(3)}`,
      minHeight: 52,
      '&.Mui-expanded': { minHeight: 52 },
      '& .MuiAccordionSummary-content': {
        margin: '6px 0',
      },
    }),
    expandIconWrapper: ({ theme }) => ({
      color: theme.palette.text.secondary,
      transition: theme.motion.short,
    }),
  },
};

export const MuiAccordionDetails: Components<Theme>['MuiAccordionDetails'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: `0 ${theme.spacing(3)} ${theme.spacing(3)}`,
      borderTop: `1px solid ${theme.border.subtle}`,
      ...theme.applyStyles('dark', { borderColor: theme.palette.grey[700] }),
    }),
  },
};
