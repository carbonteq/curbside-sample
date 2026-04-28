import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { SectionCard } from './SectionCard';

interface SocialFormFields {
  doximityUrl: string;
  linkedin: string;
  twitter: string;
  website: string;
}

interface SocialSectionProps {
  form: SocialFormFields;
  set: <K extends keyof SocialFormFields>(field: K) => (value: SocialFormFields[K]) => void;
}

export function SocialSection({ form, set }: SocialSectionProps) {
  return (
    <SectionCard
      title="Social & Web Links"
      subtitle="Public profile URLs and professional networks."
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          id="v2-doximityUrl"
          label="Doximity URL"
          type="url"
          fullWidth
          value={form.doximityUrl}
          onChange={(e) => set('doximityUrl')(e.target.value)}
          helperText=" "
          autoComplete="url"
        />
        <TextField
          id="v2-linkedin"
          label="LinkedIn"
          type="url"
          fullWidth
          value={form.linkedin}
          onChange={(e) => set('linkedin')(e.target.value)}
          helperText=" "
          autoComplete="url"
        />
        <TextField
          id="v2-twitter"
          label="X (Previously Twitter)"
          type="url"
          fullWidth
          value={form.twitter}
          onChange={(e) => set('twitter')(e.target.value)}
          helperText=" "
          autoComplete="url"
        />
        <TextField
          id="v2-website"
          label="Website"
          type="url"
          fullWidth
          value={form.website}
          onChange={(e) => set('website')(e.target.value)}
          helperText=" "
          autoComplete="url"
        />
      </Box>
    </SectionCard>
  );
}
