const HEADING_FONT = ['Montserrat', 'Arial', 'sans-serif'].join(',');
const BODY_FONT    = ['Lato', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Arial', 'sans-serif'].join(',');

export const typography = {
  fontFamily: BODY_FONT,
  htmlFontSize: 16,
  fontSize: 14,
  fontWeightLight:    300,
  fontWeightRegular:  400,
  fontWeightMedium:   500,
  fontWeightSemibold: 600,
  fontWeightBold:     700,
  h1: { fontFamily: HEADING_FONT, fontSize: '2rem',    fontWeight: 700, lineHeight: 1.25 },
  h2: { fontFamily: HEADING_FONT, fontSize: '1.5rem',  fontWeight: 700, lineHeight: 1.3  },
  h3: { fontFamily: HEADING_FONT, fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.35 },
  h4: { fontFamily: HEADING_FONT, fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4  },
  h5: { fontFamily: HEADING_FONT, fontSize: '1rem',    fontWeight: 600, lineHeight: 1.4  },
  h6: { fontFamily: HEADING_FONT, fontSize: '0.875rem',fontWeight: 600, lineHeight: 1.5  },
  subtitle1: { fontSize: '1rem',     fontWeight: 500, lineHeight: 1.5 },
  subtitle2: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.5 },
  body1:     { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.6 },
  body2:     { fontSize: '0.8125rem',fontWeight: 400, lineHeight: 1.6 },
  button:    { fontFamily: BODY_FONT, fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5, letterSpacing: '0.02em', textTransform: 'none' as const },
  caption:   { fontSize: '0.75rem',  fontWeight: 400, lineHeight: 1.5 },
  overline:  { fontSize: '0.6875rem',fontWeight: 600, lineHeight: 1.5, letterSpacing: '0.08em', textTransform: 'uppercase' as const },
  badge:     { fontFamily: BODY_FONT, fontSize: '0.625rem',  fontWeight: 700, lineHeight: 1 },
  kbd:       { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '0.6875rem', fontWeight: 400, lineHeight: 1.4 },
};
