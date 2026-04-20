export const shape = { borderRadius: 4 };

// Scalar multiplier: theme.spacing(n) = n * 4px.
// 1→4, 2→8, 3→12, 4→16, 5→20, 6→24 — MUI internals can call it with any value safely.
// For larger/semantic spacing use theme.space.* named tokens instead of raw indices.
export const spacing = 4;
