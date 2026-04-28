import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { SectionCard } from './SectionCard';

interface PrivacySectionProps {
  publicProfile: boolean;
  onChange: (value: boolean) => void;
}

export function PrivacySection({ publicProfile, onChange }: PrivacySectionProps) {
  return (
    <SectionCard
      title="Privacy"
      subtitle="Control how your profile appears to others."
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Checkbox
          id="v2-publicProfile"
          checked={publicProfile}
          onChange={(e) => onChange(e.target.checked)}
          sx={{ mt: -1, ml: -1 }}
          slotProps={{ input: { 'aria-describedby': 'v2-publicProfile-desc' } }}
        />
        <Box>
          <Typography
            component="label"
            htmlFor="v2-publicProfile"
            variant="body1"
            sx={{ fontWeight: 'fontWeightMedium', cursor: 'pointer' }}
          >
            Allow my profile to be displayed publicly
          </Typography>
          <Typography
            id="v2-publicProfile-desc"
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Name, profile image, occupation, institutions, and public content will be visible.
          </Typography>
        </Box>
      </Box>
    </SectionCard>
  );
}
