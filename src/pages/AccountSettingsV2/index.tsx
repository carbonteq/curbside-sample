import { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { X } from 'lucide-react';
import { focusRing } from '../../theme/recipes';
import { ProfileSection } from './ProfileSection';
import { PracticeSection } from './PracticeSection';
import { ProfessionalSection } from './ProfessionalSection';
import { SocialSection } from './SocialSection';
import { PasswordSection } from './PasswordSection';
import { PrivacySection } from './PrivacySection';

interface FormState {
  firstName: string;
  lastName: string;
  credentials: string;
  defaultEditingRole: string;
  phoneNumber: string;
  role: string;
  npi: string;
  occupation: string;
  primaryPracticeName: string;
  currentTitle: string;
  primaryPracticeAddress: string;
  primaryPracticePhone: string;
  primaryPracticeFax: string;
  specialties: string;
  subSpecialties: string;
  labels: string;
  doximityUrl: string;
  linkedin: string;
  twitter: string;
  website: string;
  publicProfile: boolean;
}

const INITIAL_FORM: FormState = {
  firstName: 'Mehreen',
  lastName: 'Asif',
  credentials: '',
  defaultEditingRole: '',
  phoneNumber: '',
  role: 'member',
  npi: '',
  occupation: 'Other',
  primaryPracticeName: '',
  currentTitle: '',
  primaryPracticeAddress: '',
  primaryPracticePhone: '',
  primaryPracticeFax: '',
  specialties: '',
  subSpecialties: '',
  labels: '',
  doximityUrl: '',
  linkedin: '',
  twitter: '',
  website: '',
  publicProfile: true,
};

type NavItem =
  | { kind: 'item'; label: string; active?: boolean }
  | { kind: 'category'; label: string }
  | { kind: 'divider' }
  | { kind: 'danger'; label: string };

const NAV: NavItem[] = [
  { kind: 'category', label: 'User Settings' },
  { kind: 'item', label: 'My Account', active: true },
  { kind: 'item', label: 'Disclosures' },
  { kind: 'category', label: 'App Settings' },
  { kind: 'item', label: 'Notifications' },
  { kind: 'category', label: 'Content Settings' },
  { kind: 'item', label: 'Content Settings' },
  { kind: 'item', label: 'Terms of Use' },
  { kind: 'item', label: 'Privacy Policy' },
  { kind: 'divider' },
  { kind: 'danger', label: 'Logout' },
  { kind: 'danger', label: 'Logout from all devices' },
];

export function AccountSettingsV2() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof FormState>(field: K) =>
    (value: FormState[K]) => {
      setForm(prev => ({ ...prev, [field]: value }));
      setSaved(false);
    };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    setSaved(true);
  };

  const handleCancel = () => {
    setForm(INITIAL_FORM);
    setSaved(false);
  };

  return (
    <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
      {/* Sidebar */}
      <Box
        component="nav"
        aria-label="Account settings navigation"
        sx={(theme) => ({
          width: 220,
          flexShrink: 0,
          borderRight: `1px solid ${theme.border.subtle}`,
          pt: 4,
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          ...theme.applyStyles('dark', { borderColor: theme.palette.grey[700] }),
        })}
      >
        <List disablePadding sx={{ flex: 1, px: 1 }}>
          {NAV.map((item, i) => {
            if (item.kind === 'category') {
              return (
                <Typography
                  key={i}
                  variant="overline"
                  color="text.secondary"
                  sx={{ px: 2, pt: i === 0 ? 0 : 2, pb: 1, display: 'block', lineHeight: 1.4 }}
                >
                  {item.label}
                </Typography>
              );
            }
            if (item.kind === 'divider') {
              return <Divider key={i} sx={{ my: 2 }} />;
            }
            if (item.kind === 'danger') {
              return (
                <ListItemButton
                  key={i}
                  sx={(theme) => ({
                    borderRadius: `${theme.radius.md}px`,
                    color: theme.palette.error.main,
                    '&:hover': { bgcolor: theme.palette.error.main + '14' },
                    '&:focus-visible': { ...focusRing(theme) },
                  })}
                >
                  <ListItemText
                    primary={item.label}
                    slotProps={{ primary: { variant: 'body2' } }}
                  />
                </ListItemButton>
              );
            }
            return (
              <ListItemButton
                key={i}
                selected={item.active}
                aria-current={item.active ? 'page' : undefined}
                sx={(theme) => ({
                  borderRadius: `${theme.radius.md}px`,
                  '&.Mui-selected': {
                    bgcolor: theme.fill.selected,
                    color: 'primary.main',
                    '& .MuiListItemText-primary': {
                      fontWeight: theme.typography.fontWeightSemibold,
                    },
                  },
                  '&:focus-visible': { ...focusRing(theme) },
                })}
              >
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { variant: 'body2' } }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Content header */}
        <Box
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            px: 6,
            pt: 5,
            pb: 4,
            borderBottom: `1px solid ${theme.border.subtle}`,
            ...theme.applyStyles('dark', { borderColor: theme.palette.grey[700] }),
          })}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'fontWeightSemibold', mb: 1 }}>
              My Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your profile, practice details, and account preferences.
            </Typography>
          </Box>
          <IconButton
            aria-label="Close settings"
            size="small"
            sx={(theme) => ({
              ml: 3,
              color: theme.palette.text.secondary,
              '&:focus-visible': { ...focusRing(theme) },
            })}
          >
            <X size={18} aria-hidden="true" />
          </IconButton>
        </Box>

        {/* Scrollable sections */}
        <Box
          component="main"
          id="settings-v2-content"
          tabIndex={-1}
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: { xs: 4, md: 6 },
            py: 5,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <ProfileSection form={form} set={set} saved={saved} />
          <PracticeSection form={form} set={set} />
          <ProfessionalSection form={form} set={set} />
          <SocialSection form={form} set={set} />
          <PasswordSection />
          <PrivacySection
            publicProfile={form.publicProfile}
            onChange={set('publicProfile')}
          />
        </Box>

        {/* Footer actions */}
        <Box
          sx={(theme) => ({
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            px: 6,
            py: 3,
            borderTop: `1px solid ${theme.border.subtle}`,
            ...theme.applyStyles('dark', { borderColor: theme.palette.grey[700] }),
          })}
        >
          <Button
            type="button"
            variant="outlined"
            color="neutral"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={saving}
            onClick={handleSave}
            sx={{ minWidth: 140 }}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
