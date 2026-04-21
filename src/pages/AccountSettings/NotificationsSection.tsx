import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { Bell, Mail, Smartphone } from 'lucide-react';
interface NotifState {
  pathwayUpdates:   boolean;
  taskAssignments:  boolean;
  reviewRequests:   boolean;
  systemAlerts:     boolean;
  emailDigest:      boolean;
  emailImmediate:   boolean;
  mobilePush:       boolean;
}

interface SwitchRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function SwitchRow({ id, label, description, checked, onChange }: SwitchRowProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3, py: 2 }}>
      <Box>
        <Typography variant="body1" component="label" htmlFor={id} sx={{ fontWeight: 'fontWeightMedium' }}>
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary">{description}</Typography>
      </Box>
      <Switch
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        slotProps={{ input: { 'aria-label': label } }}
      />
    </Box>
  );
}

export function NotificationsSection() {
  const [notifs, setNotifs] = useState<NotifState>({
    pathwayUpdates:  true,
    taskAssignments: true,
    reviewRequests:  true,
    systemAlerts:    false,
    emailDigest:     true,
    emailImmediate:  false,
    mobilePush:      true,
  });
  const [saved, setSaved]   = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (field: keyof NotifState) => (v: boolean) => {
    setNotifs(prev => ({ ...prev, [field]: v }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Notifications</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Choose which events trigger notifications and how you receive them.
      </Typography>

      {saved && (
        <Alert severity="success" variant="soft" sx={{ mb: 3 }}>
          Notification preferences saved.
        </Alert>
      )}

      {/* In-app */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Bell size={16} aria-hidden="true" />
        <Typography variant="h6">In-app</Typography>
      </Box>

      <Box sx={(theme) => ({ border: `1px solid ${theme.border.default}`, borderRadius: `${theme.radius.lg}px`, px: 3, ...theme.applyStyles('dark', { borderColor: theme.palette.grey[700] }) })}>
        <SwitchRow
          id="pathway-updates"
          label="Pathway updates"
          description="When a clinical pathway you're following is published or revised."
          checked={notifs.pathwayUpdates}
          onChange={set('pathwayUpdates')}
        />
        <Divider />
        <SwitchRow
          id="task-assignments"
          label="Task assignments"
          description="When a task or action step is assigned to you."
          checked={notifs.taskAssignments}
          onChange={set('taskAssignments')}
        />
        <Divider />
        <SwitchRow
          id="review-requests"
          label="Review requests"
          description="When you are added as a reviewer on a draft pathway."
          checked={notifs.reviewRequests}
          onChange={set('reviewRequests')}
        />
        <Divider />
        <SwitchRow
          id="system-alerts"
          label="System alerts"
          description="Maintenance windows, degraded service, and security notices."
          checked={notifs.systemAlerts}
          onChange={set('systemAlerts')}
        />
      </Box>

      {/* Email */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 4, mb: 1 }}>
        <Mail size={16} aria-hidden="true" />
        <Typography variant="h6">Email</Typography>
      </Box>

      <Box sx={(theme) => ({ border: `1px solid ${theme.border.default}`, borderRadius: `${theme.radius.lg}px`, px: 3, ...theme.applyStyles('dark', { borderColor: theme.palette.grey[700] }) })}>
        <SwitchRow
          id="email-digest"
          label="Daily digest"
          description="One daily summary of all activity — sent at 8 am in your local time."
          checked={notifs.emailDigest}
          onChange={set('emailDigest')}
        />
        <Divider />
        <SwitchRow
          id="email-immediate"
          label="Immediate alerts"
          description="Sends an email for high-priority items as they happen."
          checked={notifs.emailImmediate}
          onChange={set('emailImmediate')}
        />
      </Box>

      {/* Mobile */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 4, mb: 1 }}>
        <Smartphone size={16} aria-hidden="true" />
        <Typography variant="h6">Mobile push</Typography>
      </Box>

      <Box sx={(theme) => ({ border: `1px solid ${theme.border.default}`, borderRadius: `${theme.radius.lg}px`, px: 3, ...theme.applyStyles('dark', { borderColor: theme.palette.grey[700] }) })}>
        <SwitchRow
          id="mobile-push"
          label="Push notifications"
          description="Requires the Curbside Health mobile app."
          checked={notifs.mobilePush}
          onChange={set('mobilePush')}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" disabled={saving} onClick={handleSave} sx={{ minWidth: 120 }}>
          {saving ? 'Saving…' : 'Save preferences'}
        </Button>
      </Box>
    </Box>
  );
}
