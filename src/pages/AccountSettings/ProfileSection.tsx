import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import { Camera } from 'lucide-react';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  department: string;
}

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function ProfileSection() {
  const [form, setForm] = useState<FormState>({
    firstName:  'Jordan',
    lastName:   'Rivera',
    email:      'jordan.rivera@curbsidehealth.com',
    phone:      '+1 (555) 012-3456',
    title:      'Clinical Pathway Lead',
    department: 'Care Operations',
  });
  const [errors, setErrors]       = useState<Errors>({});
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [saveError, setSaveError] = useState(false);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field as keyof Errors]) setErrors(prev => ({ ...prev, [field]: undefined }));
    setSaved(false);
    setSaveError(false);
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required.';
    if (!form.lastName.trim())  e.lastName  = 'Last name is required.';
    if (!form.email.trim())          e.email = 'Email address is required.';
    else if (!validateEmail(form.email)) e.email = 'Enter a valid email address.';
    return e;
  };

  const handleBlur = (field: keyof Errors) => () => {
    const e = validate();
    if (e[field]) setErrors(prev => ({ ...prev, [field]: e[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) {
      setErrors(e2);
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    setSaved(true);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h5" gutterBottom>Profile</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your personal information and contact details.
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile saved successfully.
        </Alert>
      )}
      {saveError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Could not save changes. Please try again.
        </Alert>
      )}

      {/* Avatar row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            sx={(theme) => ({
              width: 72,
              height: 72,
              fontSize: theme.typography.h4.fontSize,
              bgcolor: theme.vars.palette.primary.main,
            })}
          >
            {form.firstName[0]}{form.lastName[0]}
          </Avatar>
          <Box
            component="label"
            aria-label="Upload profile photo"
            sx={(theme) => ({
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 24,
              height: 24,
              borderRadius: theme.radius.pill,
              bgcolor: theme.vars.palette.primary.main,
              color: theme.vars.palette.primary.contrastText,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: theme.motion.short,
              '&:hover': { bgcolor: theme.vars.palette.primary.dark },
            })}
          >
            <Camera size={12} aria-hidden="true" />
            <input type="file" accept="image/*" hidden />
          </Box>
        </Box>
        <Box>
          <Typography variant="subtitle2">{form.firstName} {form.lastName}</Typography>
          <Typography variant="body2" color="text.secondary">{form.title}</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="firstName"
            label="First name"
            required
            fullWidth
            value={form.firstName}
            onChange={set('firstName')}
            onBlur={handleBlur('firstName')}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName ?? ' '}
            autoComplete="given-name"
            slotProps={{ htmlInput: { 'aria-describedby': errors.firstName ? 'firstName-error' : undefined } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="lastName"
            label="Last name"
            required
            fullWidth
            value={form.lastName}
            onChange={set('lastName')}
            onBlur={handleBlur('lastName')}
            error={Boolean(errors.lastName)}
            helperText={errors.lastName ?? ' '}
            autoComplete="family-name"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="email"
            label="Email address"
            type="email"
            required
            fullWidth
            value={form.email}
            onChange={set('email')}
            onBlur={handleBlur('email')}
            error={Boolean(errors.email)}
            helperText={errors.email ?? ' '}
            autoComplete="email"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="phone"
            label="Phone number"
            type="tel"
            fullWidth
            value={form.phone}
            onChange={set('phone')}
            helperText=" "
            autoComplete="tel"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="title"
            label="Job title"
            fullWidth
            value={form.title}
            onChange={set('title')}
            helperText=" "
            autoComplete="organization-title"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="department"
            label="Department"
            fullWidth
            value={form.department}
            onChange={set('department')}
            helperText=" "
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          sx={{ minWidth: 120 }}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="neutral"
          onClick={() => setSaved(false)}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
