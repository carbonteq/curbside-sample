import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { SectionCard } from './SectionCard';

interface PracticeFormFields {
  primaryPracticeName: string;
  currentTitle: string;
  primaryPracticeAddress: string;
  primaryPracticePhone: string;
  primaryPracticeFax: string;
}

interface PracticeSectionProps {
  form: PracticeFormFields;
  set: <K extends keyof PracticeFormFields>(field: K) => (value: PracticeFormFields[K]) => void;
}

export function PracticeSection({ form, set }: PracticeSectionProps) {
  return (
    <SectionCard
      title="Practice Information"
      subtitle="Details about your primary medical practice."
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="v2-primaryPracticeName"
            label="Primary Practice Name"
            fullWidth
            value={form.primaryPracticeName}
            onChange={(e) => set('primaryPracticeName')(e.target.value)}
            helperText=" "
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="v2-currentTitle"
            label="Current Title / Position"
            fullWidth
            value={form.currentTitle}
            onChange={(e) => set('currentTitle')(e.target.value)}
            helperText=" "
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="v2-primaryPracticeAddress"
            label="Primary Practice Address"
            fullWidth
            value={form.primaryPracticeAddress}
            onChange={(e) => set('primaryPracticeAddress')(e.target.value)}
            helperText=" "
            autoComplete="street-address"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="v2-primaryPracticePhone"
            label="Primary Practice Phone"
            type="tel"
            fullWidth
            value={form.primaryPracticePhone}
            onChange={(e) => set('primaryPracticePhone')(e.target.value)}
            helperText=" "
            autoComplete="tel"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            id="v2-primaryPracticeFax"
            label="Primary Practice Fax"
            type="tel"
            fullWidth
            value={form.primaryPracticeFax}
            onChange={(e) => set('primaryPracticeFax')(e.target.value)}
            helperText=" "
          />
        </Grid>
      </Grid>
    </SectionCard>
  );
}
