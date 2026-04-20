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
});

theme = responsiveFontSizes(theme);

export { theme };
