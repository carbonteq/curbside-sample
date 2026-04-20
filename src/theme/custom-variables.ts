import { grey } from '@mui/material/colors';
import type { Theme } from '@mui/material/styles';

export const customVariables = (theme: Theme) => ({
  radius:    { sm: 4, md: 6, lg: 8, pill: 9999 },
  elevation: { none: 0 as const, low: 2, high: 4 },

  // Named spacing tokens — stored as px strings so sx callbacks pass raw values,
  // not array indices. Mirrors the spacing scale: [0,4,8,12,16,20,24,32,40,48,56,64].
  space: {
    '2xs': '2px',   // tightest — icon clusters, stacked action buttons
    xs:    '4px',   // tight     — within-component micro gaps
    sm:    '8px',   // compact   — list items, internal padding
    md:    '12px',  // default   — standard gaps between related elements
    lg:    '16px',  // comfortable — gaps between distinct elements
    xl:    '20px',  // generous  — section content spacing
    '2xl': '24px',  // large     — section padding
    '3xl': '32px',  // xlarge    — major section separations
    '4xl': '40px',  // page      — page-level padding
    '5xl': '48px',  // hero      — large page sections
  },

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
