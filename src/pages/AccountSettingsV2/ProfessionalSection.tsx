import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import { GraduationCap } from 'lucide-react';
import { SectionCard } from './SectionCard';

interface ProfessionalFormFields {
  specialties: string;
  subSpecialties: string;
  labels: string;
}

interface ProfessionalSectionProps {
  form: ProfessionalFormFields;
  set: <K extends keyof ProfessionalFormFields>(field: K) => (value: ProfessionalFormFields[K]) => void;
}

const SPECIALTIES = [
  'Cardiology', 'Dermatology', 'Emergency Medicine', 'Family Medicine',
  'Internal Medicine', 'Neurology', 'Oncology', 'Pediatrics', 'Psychiatry', 'Surgery',
];

const SUB_SPECIALTIES = [
  'Interventional Cardiology', 'Electrophysiology', 'Heart Failure',
  'General Surgery', 'Colorectal Surgery', 'Vascular Surgery',
];

const LABELS = ['Researcher', 'Educator', 'Clinician', 'Hospitalist', 'Intensivist'];

const OVERLAY_PROPS = { paper: { sx: { bgcolor: (t: any) => t.surface.overlay } } };

export function ProfessionalSection({ form, set }: ProfessionalSectionProps) {
  return (
    <SectionCard
      title="Professional Details"
      subtitle="Specialties, education, and professional labels."
    >
      {/* Education subsection */}
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'fontWeightSemibold' }}>
            Education
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<GraduationCap size={14} aria-hidden="true" />}
        >
          + Add Education
        </Button>
      </Box>

      <Box
        sx={(theme) => ({
          border: `1px solid ${theme.border.subtle}`,
          borderRadius: `${theme.radius.md}px`,
          px: 4,
          py: 3,
          mb: 5,
          bgcolor: theme.surface.subtle,
          ...theme.applyStyles('dark', {
            bgcolor: theme.palette.grey[900],
            borderColor: theme.palette.grey[700],
          }),
        })}
      >
        <Typography variant="body2" color="text.secondary">
          No education entries added yet.
        </Typography>
      </Box>

      {/* Specialties */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="v2-specialties-label">Specialties</InputLabel>
          <Select
            labelId="v2-specialties-label"
            id="v2-specialties"
            value={form.specialties}
            label="Specialties"
            onChange={(e) => set('specialties')(e.target.value)}
            MenuProps={{ slotProps: OVERLAY_PROPS }}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {SPECIALTIES.map(s => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
          <FormHelperText>Choose your primary specialty</FormHelperText>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="v2-subSpecialties-label">Sub Specialties</InputLabel>
          <Select
            labelId="v2-subSpecialties-label"
            id="v2-subSpecialties"
            value={form.subSpecialties}
            label="Sub Specialties"
            onChange={(e) => set('subSpecialties')(e.target.value)}
            MenuProps={{ slotProps: OVERLAY_PROPS }}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {SUB_SPECIALTIES.map(s => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
          <FormHelperText>Optional</FormHelperText>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="v2-labels-label">Labels</InputLabel>
          <Select
            labelId="v2-labels-label"
            id="v2-labels"
            value={form.labels}
            label="Labels"
            onChange={(e) => set('labels')(e.target.value)}
            MenuProps={{ slotProps: OVERLAY_PROPS }}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {LABELS.map(l => (
              <MenuItem key={l} value={l}>{l}</MenuItem>
            ))}
          </Select>
          <FormHelperText> </FormHelperText>
        </FormControl>
      </Box>
    </SectionCard>
  );
}
