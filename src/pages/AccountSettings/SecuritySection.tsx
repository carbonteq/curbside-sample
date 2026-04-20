import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Chip from '@mui/material/Chip';
import { ShieldCheck, LogOut } from 'lucide-react';

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

export function SecuritySection() {
  const [pw, setPw]           = useState<PwForm>({ current: '', next: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState<PwErrors>({});
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const set = (field: keyof PwForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPw(prev => ({ ...prev, [field]: e.target.value }));
    setPwErrors(prev => ({ ...prev, [field]: undefined }));
    setSaved(false);
  };

  const validate = (): PwErrors => {
    const e: PwErrors = {};
    if (!pw.current) e.current = 'Current password is required.';
    if (!pw.next)                   e.next = 'New password is required.';
    else if (pw.next.length < 12)   e.next = 'Password must be at least 12 characters.';
    if (!pw.confirm)                 e.confirm = 'Please confirm your new password.';
    else if (pw.next !== pw.confirm) e.confirm = 'Passwords do not match.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setPwErrors(errs); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setPw({ current: '', next: '', confirm: '' });
  };

  const sessions = [
    { id: '1', label: 'Chrome · macOS',        time: 'Active now',       current: true  },
    { id: '2', label: 'Safari · iPhone 15 Pro', time: '2 hours ago',      current: false },
    { id: '3', label: 'Firefox · Windows 11',   time: 'Yesterday 9:14 am',current: false },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Security</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Update your password and manage active sessions.
      </Typography>

      {/* Change password */}
      <Typography variant="h6" sx={{ mb: 2 }}>Change password</Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Password updated successfully.
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 420 }}>
        <TextField
          id="current-password"
          label="Current password"
          type="password"
          required
          fullWidth
          value={pw.current}
          onChange={set('current')}
          error={Boolean(pwErrors.current)}
          helperText={pwErrors.current ?? ' '}
          autoComplete="current-password"
        />
        <TextField
          id="new-password"
          label="New password"
          type="password"
          required
          fullWidth
          value={pw.next}
          onChange={set('next')}
          error={Boolean(pwErrors.next)}
          helperText={pwErrors.next ?? 'Minimum 12 characters.'}
          autoComplete="new-password"
        />
        <TextField
          id="confirm-password"
          label="Confirm new password"
          type="password"
          required
          fullWidth
          value={pw.confirm}
          onChange={set('confirm')}
          error={Boolean(pwErrors.confirm)}
          helperText={pwErrors.confirm ?? ' '}
          autoComplete="new-password"
        />
        <Box>
          <Button type="submit" variant="contained" disabled={saving} sx={{ minWidth: 160 }}>
            {saving ? 'Updating…' : 'Update password'}
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Active sessions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <ShieldCheck size={18} aria-hidden="true" />
        <Typography variant="h6">Active sessions</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sessions.map(s => (
          <Box
            key={s.id}
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderRadius: `${theme.radius.md}px`,
              border: `1px solid ${theme.border.default}`,
              backgroundColor: theme.surface.canvas,
              ...theme.applyStyles('dark', {
                backgroundColor: theme.palette.grey[800],
                borderColor: theme.palette.grey[700],
              }),
            })}
          >
            <Box sx={(theme) => ({ display: 'flex', flexDirection: 'column', gap: theme.space['2xs'] })}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" fontWeight="fontWeightMedium">{s.label}</Typography>
                {s.current && (
                  <Chip label="This device" size="small" color="success" />
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">{s.time}</Typography>
            </Box>
            {!s.current && (
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<LogOut size={14} aria-hidden="true" />}
                onClick={() => setConfirmOpen(true)}
              >
                Revoke
              </Button>
            )}
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogOut size={16} aria-hidden="true" />}
          onClick={() => setConfirmOpen(true)}
        >
          Revoke all other sessions
        </Button>
      </Box>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="revoke-dialog-title"
        aria-describedby="revoke-dialog-desc"
      >
        <DialogTitle id="revoke-dialog-title">Revoke session?</DialogTitle>
        <DialogContent>
          <DialogContentText id="revoke-dialog-desc">
            This will immediately sign out the selected device. Any unsaved work on that device will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button variant="outlined" color="neutral" onClick={() => setConfirmOpen(false)}>
            Keep session
          </Button>
          <Button variant="contained" color="error" onClick={() => setConfirmOpen(false)}>
            Revoke
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
