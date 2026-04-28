import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import { ShieldCheck } from 'lucide-react';
import { SectionCard } from './SectionCard';

interface PwForm {
  current: string;
  next: string;
  confirm: string;
}

interface PwErrors {
  current?: string;
  next?: string;
  confirm?: string;
}

function validate(pw: PwForm): PwErrors {
  const e: PwErrors = {};
  if (!pw.current) e.current = 'Current password is required.';
  if (!pw.next) e.next = 'New password is required.';
  else if (pw.next.length < 8) e.next = 'Password must be at least 8 characters.';
  if (!pw.confirm) e.confirm = 'Please confirm your new password.';
  else if (pw.next !== pw.confirm) e.confirm = 'Passwords do not match.';
  return e;
}

export function PasswordSection() {
  const [pw, setPw] = useState<PwForm>({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState<PwErrors>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (field: keyof PwForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPw(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(pw);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setPw({ current: '', next: '', confirm: '' });
  };

  return (
    <SectionCard
      title="Update Password"
      subtitle="Ensure your account is using a strong, unique password."
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {saved && (
          <Alert severity="success" sx={{ mb: 4 }}>
            Password updated successfully.
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
          <TextField
            id="v2-current-password"
            label="Current Password"
            type="password"
            fullWidth
            value={pw.current}
            onChange={set('current')}
            error={Boolean(errors.current)}
            helperText={errors.current ?? ' '}
            autoComplete="current-password"
          />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                id="v2-new-password"
                label="New Password"
                type="password"
                fullWidth
                value={pw.next}
                onChange={set('next')}
                error={Boolean(errors.next)}
                helperText={errors.next ?? ' '}
                autoComplete="new-password"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                id="v2-confirm-password"
                label="Confirm New Password"
                type="password"
                fullWidth
                value={pw.confirm}
                onChange={set('confirm')}
                error={Boolean(errors.confirm)}
                helperText={errors.confirm ?? ' '}
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Requirements box */}
        <Box
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            px: 3,
            py: 3,
            borderRadius: `${theme.radius.md}px`,
            bgcolor: theme.palette.primary.main + '12',
            mb: 4,
            ...theme.applyStyles('dark', {
              bgcolor: theme.palette.primary.main + '20',
            }),
          })}
        >
          <ShieldCheck
            size={16}
            aria-hidden="true"
            style={{ marginTop: 2, flexShrink: 0 }}
          />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'fontWeightSemibold', mb: 1 }}>
              Password requirements
            </Typography>
            <Typography variant="body2" color="text.secondary">
              At least 8 characters &bull; One uppercase letter &bull; One number or special character
            </Typography>
          </Box>
        </Box>

        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          sx={{ minWidth: 160 }}
        >
          {saving ? 'Updating…' : 'Update Password'}
        </Button>
      </Box>
    </SectionCard>
  );
}
