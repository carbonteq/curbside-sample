import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { palette } from "./palette";
import { typography } from "./typography";
import { shape, spacing } from "./shape-and-spacing";
// custom
import { components } from "./components";
import { customVariables } from "./custom-variables";

let theme = createTheme({
  cssVariables: { colorSchemeSelector: "data" },
  colorSchemes: palette,
  typography,
  shape,
  spacing,
});

theme = createTheme(theme, {
  ...customVariables(theme),
  components,
  shadows: theme.shadows.map((s, i) => {
    if (i === 2) return '0 2px 10px rgba(20,24,33,0.05), 0 1px 4px rgba(20,24,33,0.04)';
    if (i === 4) return '0 8px 40px rgba(20,24,33,0.10), 0 3px 12px rgba(20,24,33,0.06)';
    return s;
  }) as typeof theme.shadows,
});

theme = responsiveFontSizes(theme);

export { theme };
