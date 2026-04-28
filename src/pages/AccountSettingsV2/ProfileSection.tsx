import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import { SectionCard } from './SectionCard';

interface ProfileFormFields {
  firstName: string;
  lastName: string;
  credentials: string;
  defaultEditingRole: string;
  phoneNumber: string;
  role: string;
  npi: string;
  occupation: string;
}

interface ProfileSectionProps {
  form: ProfileFormFields;
  set: <K extends keyof ProfileFormFields>(field: K) => (value: ProfileFormFields[K]) => void;
  saved: boolean;
}

const ROLES = ['member', 'editor', 'reviewer', 'admin'];
const OCCUPATIONS = ['Physician', 'Nurse Practitioner', 'Physician Assistant', 'Nurse', 'Pharmacist', 'Other'];

const OVERLAY_PROPS = { paper: { sx: { bgcolor: (t: any) => t.surface.overlay } } };

export function ProfileSection({ form, set, saved }: ProfileSectionProps) {
  const initials = `${form.firstName?.[0] ?? ''}${form.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <SectionCard
      title="Profile Information"
      subtitle="Update your personal details and photo."
    >
      {saved && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Changes saved successfully.
        </Alert>
      )}

      {/* Photo upload */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 5 }}>
        <Avatar
          sx={(theme) => ({
            width: 72,
            height: 72,
            fontSize: theme.typography.h4.fontSize,
            bgcolor: theme.vars.palette.primary.main,
          })}
        >
          {initials}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'fontWeightMedium', mb: 1 }}>
            Upload a new profile photo
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            JPG or PNG. Max 2MB.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component="label"
              variant="outlined"
              color="neutral"
              size="small"
            >
              Upload Photo
              <input type="file" accept="image/jpeg,image/png" hidden />
            </Button>
            <Button variant="outlined" color="neutral" size="small">
              Remove
            </Button>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            id="v2-firstName"
            label="First Name"
            required
            fullWidth
            value={form.firstName}
            onChange={(e) => set('firstName')(e.target.value)}
            helperText=" "
            autoComplete="given-name"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            id="v2-lastName"
            label="Last Name"
            required
            fullWidth
            value={form.lastName}
            onChange={(e) => set('lastName')(e.target.value)}
            helperText=" "
            autoComplete="family-name"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            id="v2-credentials"
            label="Credentials"
            fullWidth
            value={form.credentials}
            onChange={(e) => set('credentials')(e.target.value)}
            helperText="e.g. MD, DO, PhD"
            autoComplete="honorific-suffix"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="v2-defaultEditingRole"
            label="Default Editing Role"
            fullWidth
            value={form.defaultEditingRole}
            onChange={(e) => set('defaultEditingRole')(e.target.value)}
            helperText="Shown when you edit content"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="v2-phoneNumber"
            label="Phone Number"
            type="tel"
            fullWidth
            value={form.phoneNumber}
            onChange={(e) => set('phoneNumber')(e.target.value)}
            helperText=" "
            autoComplete="tel"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="v2-role-label">Role</InputLabel>
            <Select
              labelId="v2-role-label"
              id="v2-role"
              value={form.role}
              label="Role"
              onChange={(e) => set('role')(e.target.value)}
              MenuProps={{ slotProps: OVERLAY_PROPS }}
            >
              {ROLES.map(r => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
            <FormHelperText>Assigned by your organization</FormHelperText>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            id="v2-npi"
            label="NPI"
            fullWidth
            value={form.npi}
            onChange={(e) => set('npi')(e.target.value)}
            helperText="10-digit National Provider Identifier"
            slotProps={{ htmlInput: { maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth required>
            <InputLabel id="v2-occupation-label">Occupation</InputLabel>
            <Select
              labelId="v2-occupation-label"
              id="v2-occupation"
              value={form.occupation}
              label="Occupation"
              onChange={(e) => set('occupation')(e.target.value)}
              MenuProps={{ slotProps: OVERLAY_PROPS }}
            >
              {OCCUPATIONS.map(o => (
                <MenuItem key={o} value={o}>{o}</MenuItem>
              ))}
            </Select>
            <FormHelperText> </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </SectionCard>
  );
}
