import type { Components, Theme } from '@mui/material/styles';
import { MuiAvatar }          from './MuiAvatar';
import { MuiButton }          from './MuiButton';
import { MuiCard }            from './MuiCard';
import { MuiTextField }       from './MuiTextField';
import { MuiOutlinedInput }   from './MuiOutlinedInput';
import { MuiListItemButton }  from './MuiListItemButton';
import { MuiAlert }           from './MuiAlert';
import { MuiDialog }          from './MuiDialog';
import { MuiChip }            from './MuiChip';
import { MuiDivider }         from './MuiDivider';
import { MuiSwitch }          from './MuiSwitch';
import { MuiIconButton }      from './MuiIconButton';
import { MuiLinearProgress }  from './MuiLinearProgress';
import { MuiTabs }            from './MuiTabs';
import { MuiAccordion, MuiAccordionSummary, MuiAccordionDetails } from './MuiAccordion';
// custom components
import { MuiCsStatCard }      from './MuiCsStatCard';
import { MuiCsStatusDot }     from './MuiCsStatusDot';
import { MuiCsEmptyState }    from './MuiCsEmptyState';
import { MuiCsSectionHeader } from './MuiCsSectionHeader';
import { MuiCsSidebarItem }   from './MuiCsSidebarItem';

export const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      "@media (prefers-reduced-motion: reduce)": {
        "*": {
          animationDuration: "0.01ms !important",
          animationIterationCount: "1 !important",
          transitionDuration: "0.01ms !important",
        },
      },
    },
  },
  // ── MUI built-in overrides ─────────────────────────────────────────────────
  MuiAvatar,
  MuiButton,
  MuiCard,
  MuiTextField,
  MuiOutlinedInput,
  MuiListItemButton,
  MuiAlert,
  MuiDialog,
  MuiChip,
  MuiDivider,
  MuiSwitch,
  MuiIconButton,
  MuiLinearProgress,
  MuiTabs,
  MuiAccordion,
  MuiAccordionSummary,
  MuiAccordionDetails,
  // ── Custom themed components ───────────────────────────────────────────────
  MuiCsStatCard,
  MuiCsStatusDot,
  MuiCsEmptyState,
  MuiCsSectionHeader,
  MuiCsSidebarItem,
};
