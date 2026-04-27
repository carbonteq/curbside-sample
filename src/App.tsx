import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import { useColorScheme } from '@mui/material/styles';
import { Sun, Moon, Monitor, Home } from 'lucide-react';
import { AccountSettings }           from '@/pages/AccountSettings';
import { ComponentShowcase }          from '@/pages/ComponentShowcase';
import { UsersPage }                  from '@/pages/UsersPage';
import { AnalyticsPage }              from '@/pages/AnalyticsPage';
import { PathwayScreen }              from '@/pages/PathwayScreen';
import { BrowsePage }                 from '@/pages/BrowsePage';
import { ProtocolViewerPage }         from '@/pages/ProtocolViewerPage';
import { WorkflowPage }               from '@/pages/WorkflowPage';
import { ClinicalPathwayViewerPage }  from '@/pages/ClinicalPathwayViewerPage';
import { PathwayEditorPage }          from '@/pages/PathwayEditorPage';
import { HomePage }                   from '@/pages/HomePage';
import { LibraryPage }                from '@/pages/LibraryPage';
import { CommunityPage }              from '@/pages/CommunityPage';

const FULL_HEIGHT_PATHS = new Set(['/pathway', '/browse', '/protocol', '/workflow', '/clinicalpathway', '/pathwayeditor']);

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

function Shell({ children, fullHeight }: { children: React.ReactNode; fullHeight?: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

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
          <Tooltip title="Home">
            <IconButton
              aria-label="Go to home"
              onClick={() => navigate('/')}
              size="small"
              sx={(theme) => ({
                color: isHome ? theme.palette.primary.main : theme.palette.text.secondary,
                mr: 0.5,
              })}
            >
              <Home size={20} />
            </IconButton>
          </Tooltip>

          <Typography
            variant="h6"
            component="div"
            onClick={() => navigate('/')}
            sx={{ fontWeight: 'fontWeightSemibold', whiteSpace: 'nowrap', cursor: 'pointer', mr: 1 }}
          >
            Curbside Health
          </Typography>

          <Box sx={{ flex: 1 }} />

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

      <Box sx={(theme) => ({ ...theme.mixins.toolbar, flexShrink: 0 })} />

      <Box
        id="main-content"
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: fullHeight ? 'hidden' : 'auto' }}
      >
        {children}
      </Box>
    </Box>
  );
}

function PaddedPage({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={(theme) => ({
        flex: 1,
        overflow: 'auto',
        p: { xs: 3, md: 5 },
        [theme.breakpoints.up('lg')]: { maxWidth: 1400, width: '100%', mx: 'auto' },
      })}
    >
      {children}
    </Box>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Shell><HomePage /></Shell>} />

      {/* Full-height pages */}
      <Route path="/browse"          element={<Shell fullHeight><BrowsePage /></Shell>} />
      <Route path="/protocol"        element={<Shell fullHeight><ProtocolViewerPage /></Shell>} />
      <Route path="/workflow"        element={<Shell fullHeight><WorkflowPage /></Shell>} />
      <Route path="/clinicalpathway" element={<Shell fullHeight><ClinicalPathwayViewerPage /></Shell>} />
      <Route path="/pathwayeditor"   element={<Shell fullHeight><PathwayEditorPage /></Shell>} />
      <Route path="/pathway"         element={<Shell fullHeight><PathwayScreen /></Shell>} />
      <Route path="/library"         element={<LibraryPage />} />
      <Route path="/community"       element={<CommunityPage />} />

      {/* Settings */}
      <Route path="/settings" element={
        <Shell>
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
        </Shell>
      } />

      {/* Showcase */}
      <Route path="/showcase" element={
        <Shell>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <ComponentShowcase />
          </Box>
        </Shell>
      } />

      {/* Padded pages */}
      <Route path="/users"     element={<Shell><PaddedPage><UsersPage /></PaddedPage></Shell>} />
      <Route path="/analytics" element={<Shell><PaddedPage><AnalyticsPage /></PaddedPage></Shell>} />
    </Routes>
  );
}
