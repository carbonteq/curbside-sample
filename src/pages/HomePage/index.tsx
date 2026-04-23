import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import {
  Settings,
  LayoutGrid,
  Users,
  BookOpen,
  BarChart2,
  GitBranch,
  Search,
  FileText,
  Workflow,
  Activity,
  PenTool,
  Users2,
} from 'lucide-react';

const PAGES = [
  { path: '/browse',          label: 'Browse',               description: 'Explore protocols, pathways, and content',         icon: Search },
  { path: '/protocol',        label: 'Protocol Viewer',      description: 'View and navigate clinical protocols',              icon: FileText },
  { path: '/workflow',        label: 'Workflow',             description: 'Build and manage clinical workflows',               icon: Workflow },
  { path: '/clinicalpathway', label: 'Clinical Pathway',     description: 'Interactive clinical decision pathway viewer',      icon: Activity },
  { path: '/pathwayeditor',   label: 'Pathway Editor',       description: 'Create and edit pathways visually',                 icon: PenTool },
  { path: '/pathway',         label: 'Pathway Builder',      description: 'Node-based pathway construction tool',              icon: GitBranch },
  { path: '/library',         label: 'Library',              description: 'Browse the content and resource library',           icon: BookOpen },
  { path: '/analytics',       label: 'Analytics',            description: 'View usage stats and performance metrics',          icon: BarChart2 },
  { path: '/users',           label: 'Users',                description: 'Manage users and access permissions',               icon: Users },
  { path: '/community',       label: 'Community',            description: 'Connect and collaborate with the community',        icon: Users2 },
  { path: '/showcase',        label: 'Components',           description: 'Design system component showcase',                  icon: LayoutGrid },
  { path: '/settings',        label: 'Account Settings',     description: 'Manage your profile, security, and notifications',  icon: Settings },
];

export function HomePage() {
  return (
    <Box
      sx={(theme) => ({
        flex: 1,
        overflow: 'auto',
        p: { xs: 3, md: 6 },
        bgcolor: theme.surface.canvas,
        ...theme.applyStyles('dark', { bgcolor: theme.palette.grey[900] }),
      })}
    >
      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
        <Typography variant="h4" fontWeight="fontWeightBold" gutterBottom>
          Curbside Health
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={5}>
          Select a page to get started.
        </Typography>

        <Grid container spacing={2}>
          {PAGES.map(({ path, label, description, icon: Icon }) => (
            <Grid key={path} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                variant="outlined"
                sx={(theme) => ({
                  height: '100%',
                  transition: 'border-color 150ms, box-shadow 150ms',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
                  },
                })}
              >
                <CardActionArea
                  component={Link}
                  to={path}
                  sx={{ height: '100%', alignItems: 'flex-start', p: 0 }}
                >
                  <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box
                      sx={(theme) => ({
                        mt: 0.25,
                        p: 1,
                        borderRadius: 1.5,
                        bgcolor: theme.vars.palette.primary.light,
                        color: theme.vars.palette.primary.contrastText,
                        flexShrink: 0,
                        display: 'flex',
                      })}
                    >
                      <Icon size={18} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="fontWeightSemibold">
                        {label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {description}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
