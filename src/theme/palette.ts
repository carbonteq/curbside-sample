import { createTheme } from '@mui/material/styles';
import { purple, grey, green, red, amber, blue } from '@mui/material/colors';

const tmp = createTheme();
const aug = tmp.palette.augmentColor;

export const palette = {
  light: {
    palette: {
      mode: 'light' as const,
      contrastThreshold: 4.5,
      tonalOffset: 0.2,
      primary:   aug({ color: { main: purple[500] }, name: 'primary' }),
      secondary: aug({ color: { main: purple[500] }, name: 'secondary' }),
      error:     aug({ color: { main: red[700]    }, name: 'error'    }),
      warning:   aug({ color: { main: amber[800]  }, name: 'warning'  }),
      info:      aug({ color: { main: blue[700]   }, name: 'info'     }),
      success:   aug({ color: { main: green[700]  }, name: 'success'  }),
      neutral:   aug({ color: { main: grey[600]   }, name: 'neutral'  }),
      text: {
        primary:   grey[900],
        secondary: grey[800],
        muted:     grey[600],
        disabled:  grey[500],
      },
      background: { default: '#FFFFFF', paper: '#FFFFFF' },
      divider:    grey[300],
    },
  },
  dark: {
    palette: {
      mode: 'dark' as const,
      contrastThreshold: 4.5,
      tonalOffset: 0.2,
      primary:   aug({ color: { main: purple[300] }, name: 'primary' }),
      secondary: aug({ color: { main: purple[300] }, name: 'secondary' }),
      error:     aug({ color: { main: red[300]    }, name: 'error'    }),
      warning:   aug({ color: { main: amber[300]  }, name: 'warning'  }),
      info:      aug({ color: { main: blue[300]   }, name: 'info'     }),
      success:   aug({ color: { main: green[300]  }, name: 'success'  }),
      neutral:   aug({ color: { main: grey[400]   }, name: 'neutral'  }),
      text: {
        primary:   grey[50],
        secondary: grey[100],
        muted:     grey[300],
        disabled:  grey[500],
      },
      background: { default: grey[900], paper: grey[800] },
      divider:    grey[700],
    },
  },
};
