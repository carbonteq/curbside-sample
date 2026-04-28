import * as React from 'react';
import type { Components, Theme } from '@mui/material/styles';

function UncheckedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden focusable="false">
      <rect x="1" y="1" width="16" height="16" rx="3.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CheckedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden focusable="false">
      <rect width="18" height="18" rx="4" fill="currentColor" />
      <path d="M4 9.5L7.5 13L14 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IndeterminateIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden focusable="false">
      <rect width="18" height="18" rx="4" fill="currentColor" />
      <path d="M5 9H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export const MuiCheckbox: Components<Theme>['MuiCheckbox'] = {
  defaultProps: {
    icon:              <UncheckedIcon />,
    checkedIcon:       <CheckedIcon />,
    indeterminateIcon: <IndeterminateIcon />,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(1),
      color: theme.border.strong,
      borderRadius: theme.radius.sm,
      '&.Mui-checked, &.MuiCheckbox-indeterminate': {
        color: theme.palette.primary.main,
      },
      '&.Mui-disabled': {
        color: theme.palette.action.disabled,
      },
    }),
  },
};
