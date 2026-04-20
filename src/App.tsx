import { useState } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useColorScheme } from '@mui/material/styles';
import { Sun, Moon, Monitor } from 'lucide-react';
import { AccountSettings }    from '@/pages/AccountSettings';
import { ComponentShowcase }  from '@/pages/ComponentShowcase';
import { UsersPage }          from '@/pages/UsersPage';
import { LibraryPage }        from '@/pages/LibraryPage';
import { AnalyticsPage }      from '@/pages/AnalyticsPage';
import { PathwayScreen }      from '@/pages/PathwayScreen';
import { BrowsePage }         from '@/pages/BrowsePage';
import { ProtocolViewerPage } from '@/pages/ProtocolViewerPage';
import { WorkflowPage }       from '@/pages/WorkflowPage';

type Page =
  | 'settings' | 'showcase' | 'users' | 'library' | 'analytics' | 'pathway'
  | 'browse' | 'protocol' | 'workflow';

// Pages that need full-height layout (no padding wrapper)
const FULL_HEIGHT_PAGES: Page[] = ['pathway', 'browse', 'protocol', 'workflow'];

function ColorSchemeToggle() {
  const { mode, setMode } = useColorScheme();
  const next  = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';
  const label = `Switch to ${next} mode`;
  const icon  = mode === 'light'
    ? <Sun size={18} aria-hidden="true" />
    : mode === 'dark'
      ? <Moon size={18} aria-hidden="true" />
      : <Monitor size={18} aria-hidden="true" />;
  return (
    <Tooltip title={label}>
      <IconButton aria-label={label} onClick={() => setMode(next)} size="small">
        {icon}
      </IconButton>
    </Tooltip>
  );
}

export function App() {
  const [page, setPage] = useState<Page>('browse');

  const isFullHeight = FULL_HEIGHT_PAGES.includes(page);

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        bgcolor: theme.surface.canvas,
        ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[900] }),
      })}
    >
      {/* Skip link */}
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute',
          left: '-999px',
          top: 0,
          zIndex: (theme) => theme.zIndex.tooltip + 1,
          '&:focus': { left: 8, top: 8 },
        }}
      >
        Skip to main content
      </Box>

      {/* Top app bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={(theme) => ({
          bgcolor: theme.surface.canvas,
          borderBottom: `1px solid ${theme.border.default}`,
          color: theme.palette.text.primary,
          ...theme.applyStyles('dark', {
            bgcolor: theme.palette.grey[900],
            borderColor: theme.palette.grey[700],
          }),
        })}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 }, gap: 2 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 'fontWeightSemibold', mr: 2, whiteSpace: 'nowrap' }}
          >
            Curbside Health
          </Typography>

          <Tabs
            value={page}
            onChange={(_, v: Page) => setPage(v)}
            sx={{ flex: 1 }}
            aria-label="Top-level pages"
          >
            {/* ── Original pages ── */}
            <Tab value="settings"  label="Account Settings" />
            <Tab value="showcase"  label="Components" />
            <Tab value="users"     label="Users" />
            <Tab value="library"   label="Library" />
            <Tab value="analytics" label="Analytics" />
            <Tab value="pathway"   label="Pathway Builder" />
            {/* ── New pages ── */}
            <Tab value="browse"   label="Browse" />
            <Tab value="protocol" label="Protocol Viewer" />
            <Tab value="workflow" label="Workflow" />
          </Tabs>

          <ColorSchemeToggle />
          <Tooltip title="Jordan Rivera">
            <Avatar
              sx={(theme) => ({
                width: 32,
                height: 32,
                fontSize: theme.typography.caption.fontSize,
                bgcolor: theme.vars.palette.primary.main,
                cursor: 'pointer',
              })}
              aria-label="Account menu"
            >
              JR
            </Avatar>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Toolbar offset */}
      <Box sx={(theme) => ({ ...theme.mixins.toolbar, flexShrink: 0 })} />

      {/* Page content */}
      <Box id="main-content" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Full-height pages */}
        {isFullHeight ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {page === 'pathway'  && <PathwayScreen />}
            {page === 'browse'   && <BrowsePage />}
            {page === 'protocol' && <ProtocolViewerPage />}
            {page === 'workflow' && <WorkflowPage />}
          </Box>
        ) : page === 'settings' ? (
          <Box
            sx={(theme) => ({
              flex: 1,
              display: 'flex',
              overflow: 'auto',
              [theme.breakpoints.up('md')]: { maxWidth: 1200, width: '100%', mx: 'auto' },
            })}
          >
            <AccountSettings />
          </Box>
        ) : page === 'showcase' ? (
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <ComponentShowcase />
          </Box>
        ) : (
          <Box
            sx={(theme) => ({
              flex: 1,
              overflow: 'auto',
              p: { xs: 3, md: 5 },
              [theme.breakpoints.up('lg')]: { maxWidth: 1400, width: '100%', mx: 'auto' },
            })}
          >
            {page === 'users'     && <UsersPage />}
            {page === 'library'   && <LibraryPage />}
            {page === 'analytics' && <AnalyticsPage />}
          </Box>
        )}
      </Box>
    </Box>
  );
}
