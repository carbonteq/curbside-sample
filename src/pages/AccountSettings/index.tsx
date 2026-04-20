import { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { User, ShieldCheck, Bell } from 'lucide-react';
import { ProfileSection }       from './ProfileSection';
import { SecuritySection }      from './SecuritySection';
import { NotificationsSection } from './NotificationsSection';

type SectionId = 'profile' | 'security' | 'notifications';

const nav: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  { id: 'profile',       label: 'Profile',       icon: <User size={18} aria-hidden="true" /> },
  { id: 'security',      label: 'Security',       icon: <ShieldCheck size={18} aria-hidden="true" /> },
  { id: 'notifications', label: 'Notifications',  icon: <Bell size={18} aria-hidden="true" /> },
];

export function AccountSettings() {
  const [active, setActive] = useState<SectionId>('profile');

  const section = active === 'profile'       ? <ProfileSection />
                : active === 'security'      ? <SecuritySection />
                : <NotificationsSection />;

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      {/* Sidebar nav */}
      <Box
        component="nav"
        aria-label="Account settings sections"
        sx={(theme) => ({
          width: 220,
          flexShrink: 0,
          borderRight: `1px solid ${theme.border.subtle}`,
          pt: 3,
          px: 1,
          ...theme.applyStyles('dark', {
            borderColor: theme.palette.grey[700],
          }),
        })}
      >
        <Typography
          variant="overline"
          color="text.muted"
          sx={{ px: 2, mb: 1, display: 'block' }}
        >
          Account
        </Typography>
        <List disablePadding>
          {nav.map(item => (
            <ListItemButton
              key={item.id}
              selected={active === item.id}
              onClick={() => setActive(item.id)}
              aria-current={active === item.id ? 'page' : undefined}
            >
              <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ variant: 'body1' }}
              />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ mt: 2, mx: 2 }} />
      </Box>

      {/* Content area */}
      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{ flex: 1, p: { xs: 3, md: 5 }, overflowY: 'auto' }}
      >
        {section}
      </Box>
    </Box>
  );
}
