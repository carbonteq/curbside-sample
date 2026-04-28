import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

interface SectionCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <Box
      sx={(theme) => ({
        border: `1px solid ${theme.border.default}`,
        borderRadius: `${theme.radius.lg}px`,
        bgcolor: theme.surface.canvas,
        overflow: 'hidden',
        flexShrink: 0,
        ...theme.applyStyles('dark', {
          bgcolor: theme.palette.grey[800],
          borderColor: theme.palette.grey[700],
        }),
      })}
    >
      <Box sx={{ px: 5, py: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'fontWeightSemibold', mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ px: 5, py: 4 }}>{children}</Box>
    </Box>
  );
}
