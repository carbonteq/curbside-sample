import { createTheme } from '@mui/material/styles';
import { grey, red, blue } from '@mui/material/colors';

const tmp = createTheme();
const aug = tmp.palette.augmentColor;

export const palette = {
  light: {
    palette: {
      mode: 'light' as const,
      contrastThreshold: 4.5,
      tonalOffset: 0.2,
      primary:   aug({ color: { main: '#586EE0', dark: '#3754A1', light: '#7B8EE8', contrastText: '#FFFFFF' }, name: 'primary' }),
      secondary: aug({ color: { main: '#586EE0', dark: '#3754A1', light: '#7B8EE8', contrastText: '#FFFFFF' }, name: 'secondary' }),
      error:     aug({ color: { main: red[700]   }, name: 'error'   }),
      warning:   aug({ color: { main: '#7F4C06'  }, name: 'warning' }),
      info:      aug({ color: { main: blue[700]  }, name: 'info'    }),
      success:   aug({ color: { main: '#1D632C'  }, name: 'success' }),
      neutral:   aug({ color: { main: '#767684'  }, name: 'neutral' }),
      text: {
        primary:   '#2B2A35',
        secondary: '#545465',
        heading:   '#1E1D28',
        muted:     '#939DA8',
        disabled:  '#939DA8',
      },
      background: { default: '#F2FBF5', paper: '#F6F6F9' },
      divider:    '#DDDFE5',
    },
  },
  dark: {
    palette: {
      mode: 'dark' as const,
      contrastThreshold: 4.5,
      tonalOffset: 0.2,
      primary:   aug({ color: { main: '#7B8EE8', dark: '#586EE0', contrastText: '#FFFFFF' }, name: 'primary' }),
      secondary: aug({ color: { main: '#7B8EE8', dark: '#586EE0', contrastText: '#FFFFFF' }, name: 'secondary' }),
      error:     aug({ color: { main: red[300]  }, name: 'error'   }),
      warning:   aug({ color: { main: '#FFBB5B' }, name: 'warning' }),
      info:      aug({ color: { main: blue[300] }, name: 'info'    }),
      success:   aug({ color: { main: '#5DCE89' }, name: 'success' }),
      neutral:   aug({ color: { main: grey[400] }, name: 'neutral' }),
      text: {
        primary:   grey[50],
        secondary: grey[200],
        muted:     grey[400],
        disabled:  grey[600],
      },
      background: { default: grey[900], paper: grey[800] },
      divider:    grey[700],
    },
  },
};
