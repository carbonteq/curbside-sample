import type { Components, Theme } from '@mui/material/styles';

export const MuiMenuItem: Components<Theme>['MuiMenuItem'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      variants: [
        {
          // filter — consistent dropdown item for checkbox, radio, and icon menus
          props: { variant: 'filter' },
          style: {
            borderRadius: `${theme.radius.md}px`,
            marginLeft: theme.spacing(1),   // 4px
            marginRight: theme.spacing(1),  // 4px
            paddingLeft: theme.spacing(4),  // 16px
            paddingRight: theme.spacing(4), // 16px
            minHeight: 44,                  // design-specific; not on spacing scale
            gap: theme.spacing(3),          // 12px
            fontSize: theme.typography.body2.fontSize,
            fontWeight: theme.typography.fontWeightMedium,
            color: theme.palette.text.secondary,
            '&.Mui-selected': {
              fontWeight: theme.typography.fontWeightSemibold,
              color: theme.palette.primary.main,
            },
          },
        },
      ],
    }),
  },
};
