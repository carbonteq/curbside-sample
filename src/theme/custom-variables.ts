import { grey } from '@mui/material/colors';
import type { Theme } from '@mui/material/styles';

export const customVariables = (theme: Theme) => ({
  radius:    { sm: 4, md: 6, lg: 8, pill: 9999 },
  elevation: { none: 0 as const, low: 2, high: 4 },

  surface: {
    canvas:  '#FFFFFF',
    subtle:  grey[50],
    raised:  grey[100],
    overlay: '#FFFFFF',
    scrim:   'rgba(15,23,42,0.5)',
  },

  fill: {
    default:  grey[100],
    emphasis: grey[200],
    selected: theme.palette.action.selected,
  },

  border: {
    subtle:  grey[100],
    default: grey[300],
    strong:  grey[400],
  },

  motion: {
    short: theme.transitions.create(
      ['background-color', 'border-color', 'color', 'box-shadow'],
      { duration: theme.transitions.duration.short, easing: theme.transitions.easing.easeInOut },
    ),
    standard: theme.transitions.create(
      ['background-color', 'border-color', 'color', 'transform', 'opacity'],
      { duration: theme.transitions.duration.standard, easing: theme.transitions.easing.easeInOut },
    ),
    complex: theme.transitions.create(
      ['transform', 'opacity'],
      { duration: theme.transitions.duration.complex, easing: theme.transitions.easing.easeInOut },
    ),
    enter: theme.transitions.create(
      ['opacity', 'transform'],
      { duration: theme.transitions.duration.enteringScreen, easing: theme.transitions.easing.easeOut },
    ),
    leave: theme.transitions.create(
      ['opacity', 'transform'],
      { duration: theme.transitions.duration.leavingScreen, easing: theme.transitions.easing.easeIn },
    ),
  },
});
